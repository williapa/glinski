 
import { useCallback, useEffect, useRef, useState } from 'react';
import pieceColor from '../util/pieceColor';
import Moves from '../moves';
import Popup from './popup/Popup';
import calculateRemainingTime from '../util/calculateRemainingTime';
import check from '../util/check';
import checkMate from '../util/checkMate';
import filterMoves from '../util/filterMoves';
import isValidPromotion from '../util/isValidPromotion';
import newBoard from '../util/newBoard';
import CapturedPieces from './panels/CapturedPieces.jsx';
import Animation from './animation/Animation.jsx';
import BoardCell from './BoardCell';
import ConfigForm from './panels/ConfigForm.jsx';
import MoveLog from './panels/MoveLog.jsx';
import PlayerLabels from './panels/labels/PlayerLabels';
import useFetch from "../hooks/useFetch";
import { useDisableClicks } from '../hooks/useDisableClicks';
import Ftr from "../footer/Ftr";
import Borderline from "./Borderline.jsx";
import Clocks from "./panels/labels/clock/Clocks";
import AudioPlayer from "../audio/AudioPlayer";
import api from '../api.js';
import './GameBoard.css';
import './GameLayout.css';
import rowColToLetterCol from '../util/rowColToLetterCol.js';

const cellColors = ['beige', 'peach', 'brown']; // these correspond to class names they are not the real colors im sorry
const POLLING_INTERVAL = 10 * 1000;
const version = process.env.REACT_APP_VERSION || '18';

function GameLayout({ playerId, id }) {
  const API = api();
  const formRef = useRef(null);
  const { setClicksDisabled } = useDisableClicks();
  const [flash, setFlash] = useState({
    startPosition: { row: -1, col: -1, },
    endPosition: { row: -1, col: -1, },
    keyCount: 0
  });
  const [chatFirst, setChatFirst] = useState(true);
  const [colorChoice, setColorChoice] = useState('random');
  const [inCheck, setCheck] = useState(false);
  const [promotion, setPromotion] = useState(false);
  const [turn, setTurn] = useState('w');
  const [board, setBoard] = useState(newBoard());
  const [moves, setMoves] = useState([]);
  const [votes, setVotes] = useState([]);
  const [newMove, setNewMove] = useState({});
  const [hilightedCells, setHilightedCells] = useState({});
  const [enPassantPawnPosition, setEnPassantPawnPosition] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ b: [], w: [] });
  const [gameOver, setGameOver] = useState(true);
  const [turnMins, setTurnMins] = useState(10);
  const useMuted = useState(false);
  const [sound, playSound] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [switchNextGame, setSwitchNextGame] = useState(false);
  const [poll, setPoll] = useState(null);
  const [opponent, setOpponent] = useState('');
  const [block, setBlock] = useState(false);
  const [aiMoveText, setAiMoveText] = useState(false);

  const aiMove = async () => {
    // todo: make a toggle that returns here, toggling ai
    setBlock(true);
    console.log('start ai move worker...');
    const startTime = new Date().getTime();
    const aiWorker = new Worker(new URL('../worker/worker.js', import.meta.url), {
      type: 'module'
    });
    const [moveValue, coords] = await new Promise((resolve) => {
      aiWorker.addEventListener("message", (message) => {
        resolve(message.data);
      });
      aiWorker.onerror = (e) => {
        console.error('Worker error:', e.message);
      }; 
      aiWorker.postMessage({ board, capturedPieces, chatFirst, enPassantPawnPosition });
    });
    const endTime = new Date().getTime();
    console.log(`ai took ${endTime - startTime} ms to find this move:`); // includes module load
    console.log(`coords: ${JSON.stringify(coords.startPosition)} to ${JSON.stringify(coords.endPosition)}. valued at: ${moveValue}`);

    if (!coords) {
      console.warn("coords are missing - not dropping piece. its just gonna sit.");
    } else {
      // re-use build on drop. since there's no more need for that functionality (for streamer)
      // you can just mangle it
      // but keep in mind there's going to be need to split up to share with viewer who could drag drop to vote 
      
      const startPos = {
        row: coords.startPosition.row,
        col: coords.startPosition.column
      }
      const peace = board[startPos.row][startPos.col];
      const plainTextMove = `${rowColToLetterCol(startPos.row, startPos.col)} ${rowColToLetterCol(coords.endPosition.row, coords.endPosition.col)}${coords.promotion ? ' ' + coords.promotion.charAt(1) : ''}`
      // typing animation taken care of within Animation component
      setAiMoveText(plainTextMove);
      playSound('mouseClick');
      // hilight cells after 300ms - enough time to see the first coordinate...somethin fucked up tho
      setTimeout(() => {
        hilightCells(coords.startPosition.row, coords.startPosition.column, peace);
      }, 1000);
      // trying to clean up before we go to bed
      setTimeout(() => {
        setHilightedCells({});
      }, 3000);
      setTimeout(() => {
        setFlasher({
          startPosition: startPos,
          endPosition: coords.endPosition,
        });
        buildOnDrop(coords.endPosition.row, coords.endPosition.col, true, coords.promotion)(startPos);
        setAiMoveText(false);
        console.log('terminating...');
        aiWorker.terminate();
        setBlock(false);
      }, 3600);
    }

  };
  
  const gameChanger = useCallback((newVal) => {
    setGameOver((prev) => {
      if (prev !== newVal && !!newVal && !poll) {
        if (chatFirst === (newVal === 'b')) {
          playSound('youWin');
        } else if (chatFirst === (newVal === 'w')) {
          playSound('youLose');
        } else if (newVal === 'tie') {
          playSound('draw');
        } 
      }
      return newVal;
    });
  }, [gameOver, chatFirst]);

  const setFlasher = (newFlash) => {
    const keyCount = flash.keyCount + 1;
    setFlash({
      ...newFlash,
      keyCount
    });
  }

  const turnChanger = useCallback((newVal) => {
    setTurn((previousTurn) => {
      if (previousTurn !== newVal && !gameOver && newVal === (chatFirst ? 'b' : 'w')) {
        playSound('yourMove');
      }
      return newVal;
    });
  }, [turn, chatFirst, gameOver]);

  const setResults = (result) => {
    const currentTurn = (result.moves.length % 2) ? 'b' : 'w';
    setBoard(result.board);
    setCapturedPieces(result.capturedPieces);
    setChatFirst(result.chatFirst);
    setEnPassantPawnPosition(result.enPassantPawnPosition);
    setMoves(result.moves);
    setVotes(result.votes);
    if (result.gameConfig) {
      setTurnMins(result.gameConfig.turnMins);
      setStartTime(result.gameConfig.startTime);
      setOpponent(result.gameConfig.opponent);
      if (formRef.current) {
        formRef.current.turnMin.value = result.gameConfig.turnMins;
        formRef.current.votes.value = result.gameConfig.votes;
      }
      setSwitchNextGame(!!result.gameConfig.switchNextGame);
      
    }
    setCheck(result.check);
    gameChanger(result.gameOver);
    turnChanger(currentTurn);
    // re - enable clicking 
    const urColor = (result.chatFirst) ? 'b' : 'w'; 
    setClicksDisabled(result.gameOver ? true : currentTurn !== urColor);
  };

  const resolveGameByClock = async (color) => {
    const postMoveResult = await fetch(`${API}${id}`, {
      method: 'POST',
      body: JSON.stringify({ checkTimeForWinner: color, playerId, version })
    });
    if (postMoveResult.status !== 200) {
      // now you can click again if you'd like 
      window.alert('something went wrong ending game. please reload.');
    } else {
      const result = await postMoveResult.json();
      setResults(result);
    }
  }

  // todo: catch error and re-get the board
  const postMove = async (move) => {
    setClicksDisabled(true);
    const gameConfig = {
      startTime: new Date().getTime(),
      turnMins: formRef.current.turnMin.value,
      votes: formRef.current.votes.value,
    };
    // empty move = start game
    if (!move.piece && !move.startPosition && !move.endPosition) {
      // todo: better loading state
      const userChoice = formRef.current.chatFirst.value;
      gameConfig.chatFirst = userChoice;
      gameConfig.opponent = move.username;
      setResults({ 
        board: newBoard(),
        check: false,
        capturedPieces: { 'b': [], 'w': [] },
        chatFirst: userChoice === 'random' ? move.newChatFirst : userChoice === 'switch' ? !chatFirst : chatFirst,
        gameOver: false,
        enPassantPawnPosition: false,
        moves: [],
        votes: [],
        gameConfig: {
          startTime: new Date().getTime(),
          turnMins: formRef.current.turnMin.value,
          votes: formRef.current.votes.value,
          opponent: move.username
        }
      });
      delete move.username;
    } else if (gameOver) {
      // if you're receving a move with a piece/position and the game is over, 
      // something is wrong on the ui end, but the move shouldn't be posted so return
      console.error('something is wrong on the front end - you are trying to move, but the game is over.');
      return;
    }
    try {
      const postMoveResult = await fetch(`${API}${id}`, {
        method: 'POST',
        body: JSON.stringify({ move, gameConfig, playerId, version })
      });

      if (postMoveResult.status !== 200) {
        // now you can click again if you'd like 
        window.location.reload();
      } else {
        const result = await postMoveResult.json();
        // todo: this will take a long time, but contain chat's move as the response 
        // set those values here 
        setResults(result);
      }
    } catch (e) {
      console.error('you are exiting a game mid chat move. you will not get an immediate update for their next move.');
    }
  };

  const startGame = async (e, username = '') => {
    e.preventDefault();
    const newChatFirst = !switchNextGame ? chatFirst: !chatFirst;
    playSound('startGame');
    await postMove({ newChatFirst, username });
  };

  const hilightCells = (row, column, piece) => {
    const pieceClass = piece.substr(1);
    if (!Moves[pieceClass]) return;
    const moves = Moves[pieceClass](row,column,board,enPassantPawnPosition);
    // filter moves that would put the player in check
    const nonCheckCausingMoves = filterMoves(moves, board, [piece, { row, column }]);
    setHilightedCells(nonCheckCausingMoves);
  }

  const hilighter = (x,y) => {
    if (!x) {
      setHilightedCells({});
    } else {
      const piece = board[x][y];
      if (piece) {
        hilightCells(x,y,piece);
      }
    }
  }

  // built so that you dont have to pass the board or the position or the setters into the piece
  const buildHilightCells = (x,y) => {
    return (piece) => {
      if (piece) {
        playSound('pickUp');
        hilightCells(x,y,piece);
      } else {
        setHilightedCells({});
        if ((turn === 'b') === chatFirst) playSound('putDownCancel');
      }
    };
  }
  // the ondragOver function needs to prevent default when you can drop it, otherwise not do anything.
  const buildOnDragOver = (row, col) => {
    return (e) => {
      if (hilightedCells[row] && hilightedCells[row].indexOf(col) > -1) {       
        e.preventDefault();
      }
    };
  }
  // the onDrop function needs to setBoard based on the piece for which the move is being received.
  // todo: clean this up, it's too long. worst case move it 
  const buildOnDrop = (row, col, streamer, promo) => {
    return (e) => {
      if (!streamer) e.preventDefault();
      // if streamer, e is just the start position right off the bat
      const startPosition = streamer ? e : JSON.parse(e.dataTransfer.getData('application/json'));
      let removedPiece = board[row][col];
      // todo: remove
      console.log("just checking to see if the game is over hehe: ");
      console.log(gameOver);
      if (gameOver) return; // avoiding race with clock and ai. i have seen it. it breaks stuff.
      let isGameOver = false;
      if (enPassantPawnPosition) {
        // white direction is negative 1, so add negative 1 to the column and if this is the dest, remove the en passant pawn
        // black direction is positive 1, so add 1 to the column and if it is the dest, remove the en passant pawn. 
        // and make sure to identify the en passant pawn as the removed piece so the logic below tracks the killed pieces
        const dir = turn === 'w' ? 1 : -1;
        if (enPassantPawnPosition.row === row && enPassantPawnPosition.col  === col + dir) {
          removedPiece = board[enPassantPawnPosition.row][enPassantPawnPosition.col];
          board[enPassantPawnPosition.row][enPassantPawnPosition.col] = 0;
        }
      }
      if (removedPiece) {
        playSound('putDownTake');
        capturedPieces[removedPiece.charAt(0)].push(removedPiece);
        setCapturedPieces({ ...capturedPieces });
      } else {
        playSound('putDownMove');
      }
      // check for en passant pawn move. This means the piece is a pawn and the column is changing by more than 1
      if (board[startPosition.row][startPosition.col].substring(1) === "Pawn" && Math.abs(col - startPosition.col) > 1) {
        setEnPassantPawnPosition({ row, col });
      } else {
        // capturing en passant is permitted only on the turn immediately after the two square advance, so 
        // the next move clears whatever position was being tracked.
        setEnPassantPawnPosition(false);
      }
      // pawn upgrade logic - DISABLED via "Streamer" option which is the ai flag 
      if (!streamer && isValidPromotion(board, row, col) && board[startPosition.row][startPosition.col].substring(1) === 'Pawn') {
        setPromotion({ source: startPosition, dest: { row, col }});
        board[row][col] = board[startPosition.row][startPosition.col];
        board[startPosition.row][startPosition.col] = 0;
        setHilightedCells({});
        setBoard([...board]);
        setNewMove({
          startPosition,
          removedPiece,
          endPosition: {
            row, 
            col,
          },
          promoted: true
        });
      } else {
        // for promotion (not using manual ui anymore that's all the stuff above)
        const finalPiece = promo || board[startPosition.row][startPosition.col];
        board[row][col] = finalPiece;
        board[startPosition.row][startPosition.col] = 0;
        setHilightedCells({});
        setBoard([...board]);
        const nextTurn = (turn === 'w' ? 'b' : 'w');
        // check mate 
        const checkmate = checkMate(board, nextTurn, enPassantPawnPosition);
        if (checkmate && checkmate !== 'tie') {
          isGameOver = turn;
        } else if (checkmate === 'tie') {
          isGameOver = checkmate;
        }
        // add move to move log
        const thisIsTheMove = {
          time: Date.now(),
          piece: finalPiece,
          promoted: !!promo,
          gameOver: isGameOver,
          removedPiece,
          endPosition: {
            row,
            col
          },
          startPosition
        };
        setMoves([
          thisIsTheMove,
          ...moves
        ]);
        setNewMove({});
        turnChanger(nextTurn);
        postMove(thisIsTheMove);
        if (check(board, nextTurn)) {
          setCheck(true);
        }
      }
    }
  }

  const promote = (piece, row, column) => {
    const newTurn = turn === 'w' ? 'b' : 'w';
    setPromotion(false);
    board[row][column] = piece;
    setBoard([...board]);
    let gameOver = false;
    const checkmate = checkMate(board, newTurn, enPassantPawnPosition);
    // check mate
    if (checkmate && checkmate !== 'tie') {
      window.alert(`checkmate - ${turn} wins`);
      gameOver = turn;
    } else if (checkmate === 'tie') {
      window.alert("game is a tie");
      gameOver = checkmate;
    }
    newMove.promoted = true;
    const thisIsTheMove = {
      ...newMove,
      piece,
      gameOver,
      time: Date.now(),
    };
    setMoves([
      thisIsTheMove,
      ...moves,
    ]);
    setNewMove({});
    turnChanger(newTurn);
    playSound('putDownPromote');
    postMove(thisIsTheMove);
  };

  const cancelPromote = () => {
    const { source, dest } = promotion;
    const { row, col } = source;
    board[row][col] = board[dest.row][dest.col];
    board[dest.row][dest.col] = 0;
    setNewMove({});
    setPromotion(false);
    playSound('putDownCancel');
    setBoard([...board]);
  }

  const { data, loading, error, fetchData } = useFetch(`${API}${id}`);

  useEffect(() => {
    if (!gameOver && !block && turn === (chatFirst ? 'b' : 'w')) {
      aiMove();
    }
  }, [block, chatFirst, gameOver, turn])

  useEffect(() => {
    // re-fetch every 15 seonds if it's not your turn and game is not over (this is called once per page so it means you got disconnected
    if (!loading && data && !data.gameOver && !poll && (data.chatFirst === !(data.moves.length % 2))) {
      console.log("setting poll");
      const newPoll = setTimeout(async () => {
        await fetchData();
        setPoll(null);
      }, POLLING_INTERVAL);
      setPoll(newPoll);
    } else if (!loading && data && poll && (data.gameOver || (data.chatFirst === (data.moves.length % 2)))) {
      console.log("clearing poll because the data says its ok");
      clearTimeout(poll);
      setPoll(null);
    }

    if (!loading && data && data.gameConfig) {
      setResults(data);

      const remainingTime = calculateRemainingTime(data.moves, data.gameConfig, ['w', 'b'][data.moves.length % 2]);
      if (remainingTime < 0) {
        if (!data.gameOver) resolveGameByClock(turn === 'b' ? 'w' : 'b');
        if (poll) {
          clearTimeout(poll);
          setPoll(null);
        }
      } 
    }
  }, [loading]);
  
  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  // row - index    column - i 
  return (
    <div style={{ marginTop: '20px',  maxWidth: 'fit-content' }}>
      <AudioPlayer muted={useMuted[0]} sound={sound} />
      <div className="scale position" >
      { board.map((row, index) => {
        return (
          <div key={`row${index}`} className='hex-row' style={{ marginLeft: Math.abs(index - 5) * 53 }}>
            { row.map((cell, i) => {
              // todo: marking this as important for when implementing chatter client
              const movable = cell && cell.charAt(0) === turn;
              const rowColorOffset = index % 3;
              let cellColor = cellColors[(i + rowColorOffset) % 3];
              if (index > 5) {
                cellColor = cellColors[(10 - index + i) % 3];
              }
              const isDestination = hilightedCells[index] && hilightedCells[index].indexOf(i) > -1;
              return (
                <BoardCell
                  key={`cell${index},${i},${flash.keyCount}`}
                  cell={cell}
                  cellColor={cellColor}
                  from={(flash.startPosition.row === index && flash.startPosition.col === i)}
                  i={i}
                  index={index}
                  isDestination={isDestination}
                  movable={movable}
                  onDragOver={buildOnDragOver(index, i)}
                  onDrop={buildOnDrop(index, i)}
                  onStart={buildHilightCells(index,i)}
                  pieceColor={pieceColor(cell)}
                  to={(flash.endPosition.row === index && flash.endPosition.col === i)}
                  turn={turn}
                  chatFirst={chatFirst}
                />
              );
            }) }
          </div>
        );
      }) }
      </div>
      <PlayerLabels chatFirst={chatFirst}
        check={inCheck}
        gameOver={gameOver}
        id={id}
        opponent={opponent}
        turn={turn}
      />
      <Clocks chatFirst={chatFirst}
        endGame={resolveGameByClock}
        gameOver={gameOver}
        moves={moves}
        startTime={startTime}
        turn={turn}
        turnMins={turnMins}
      />
      <CapturedPieces capturedPieces={capturedPieces} />
      <Borderline />
      <ConfigForm clickDisabled={chatFirst === (turn === 'w')}
        colorChoice={colorChoice}
        gameOver={gameOver}
        ref={formRef}
      />
      <MoveLog ai={aiMove} 
        board={board}
        channel={id}
        chatFirst={chatFirst}
        enPassantPawnPosition={enPassantPawnPosition}
        gameOver={gameOver}
        hilighter={hilighter}
        initialVotes={votes}
        moves={moves}
        polling={poll}
        setColorChoice={setColorChoice}
        setFlash={setFlasher}
        startGame={startGame}
        startTime={startTime}
        useMuted={useMuted}
      />
      <Animation move={aiMoveText} />
      <Popup 
        isVisible={promotion}
        color={turn}
        onCancel={cancelPromote}
        onConfirm={promote}
      />
      <Ftr />
    </div>
  );
}

export default GameLayout;
