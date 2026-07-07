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
import rng from '../util/rng.js';
import CapturedPieces from './panels/CapturedPieces.jsx';
import BoardCell from './BoardCell';
import ConfigForm from './panels/ConfigForm.jsx';
import MoveLog from './panels/MoveLog.jsx';
import PlayerLabels from './panels/labels/PlayerLabels';
import useFetch from '../hooks/useFetch';
import endGame from '../storage/endGame.js';
import saveGame from '../storage/saveGame.js';
import { useDisableClicks } from '../hooks/useDisableClicks';
import Ftr from '../footer/Ftr';
import Clocks from './panels/labels/clock/Clocks';
import AudioPlayer from '../audio/AudioPlayer';
import Meter from './panels/labels/meter/Meter.jsx';
import Ticker from './panels/ticker/Ticker.jsx';
import hashRepeatedThrice from '../util/hashRepeatedThrice.js';
import evaluateBoard from '../worker/ai/evaluateBoard.js';
import './GameBoard.css';
import './GameLayout.css';

const cellColors = ['beige', 'peach', 'brown']; // these correspond to class names they are not the real colors im sorry
const TURN_MIN_OPTIONS = [1, 2, 5, 10, 15, 20, 30, 45, 60, 90];

function GameLayout({ id }) {
  const formRef = useRef(null);
  const { setClicksDisabled } = useDisableClicks();
  const [flash, setFlash] = useState({
    startPosition: { row: -1, col: -1, },
    endPosition: { row: -1, col: -1, },
    keyCount: 0
  });
  const [playersRng, setPlayersRng] = useState({ 
    chat: 0,
    streamer: 0
  });
  const [boardEval, setBoardEval] = useState(0);
  const [chatFirst, setChatFirst] = useState(true);
  const [colorChoice, setColorChoice] = useState('white');
  const [inCheck, setCheck] = useState(false);
  const [promotion, setPromotion] = useState(false);
  const [turn, setTurn] = useState('w');
  const [board, setBoard] = useState(newBoard());
  const [moves, setMoves] = useState([]);
  const [moveHashTable, setMoveHashTable] = useState({});
  const [votes, setVotes] = useState([]);
  const [newMove, setNewMove] = useState({});
  const [hilightedCells, setHilightedCells] = useState({});
  const [enPassantPawnPosition, setEnPassantPawnPosition] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ b: [], w: [] });
  const [gameOver, setGameOver] = useState(true);
  const [turnMins, setTurnMins] = useState(2);
  const useMuted = useState(false);
  const [sound, playSound] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [opponent, setOpponent] = useState('');
  const [block, setBlock] = useState(false);
  const [soundAlert, setSoundAlert] = useState(true);
  const [streamerAiEnabled, setStreamerAiEnabled] = useState(false);
  
  const aiMove = async (isChatsMove = false) => {
    console.log(playersRng);
    const letAiMoveForStreamer = streamerAiEnabled;
    const letAiMoveForChat = document.getElementById('votes').value < 1;
    const letAiMove = (chatFirst === (turn === 'w')) ? letAiMoveForChat : letAiMoveForStreamer;
    if (!letAiMove) {
      console.log('ai no move!');
      return;
    };
    // force a random selection at later times in the game as well
    const randomization = isChatsMove ? playersRng.chat : playersRng.streamer;
    // now we roll the dice and find out if we get a good move or a borked one
    // starting moves = random moves hence making it 0
    const halfMoves = Math.floor(Math.random() * 100) < randomization ? 0 : moves.length;

    setBlock(true);
    console.log('start ai move worker...');
    const startTime = new Date().getTime();
    const aiWorker = new Worker(new URL('../worker/ai/worker.js', import.meta.url), {
      type: 'module'
    });
    const [moveValue, coords, isRandom] = await new Promise((resolve) => {
      aiWorker.addEventListener('message', (message) => {
        resolve(message.data);
      });
      aiWorker.onerror = (e) => {
        console.error('Worker error:', e);
        console.log(e);
      }; 
      aiWorker.postMessage({ board, capturedPieces, chatFirst, enPassantPawnPosition, isChatsMove, halfMoves });
    });
    const endTime = new Date().getTime();
    const totalTimeTaken = endTime - startTime;
    console.log(`ai took ${totalTimeTaken} ms to find this move:`); // includes module load
    console.log(coords);
    console.log(moveValue);
    if (isRandom) {
      console.log("RANDOM MOVE!");
    } 
    const remainingTime = calculateRemainingTime(moves, { startTime, turnMins }, (chatFirst === isChatsMove ? 'w' : 'b'));
    console.log(`remaining time: ${remainingTime}`);
    if (!coords) {
      if (inCheck) {
        const winner = isChatsMove ? (chatFirst ? 'b' : 'w') : chatFirst ? 'w': 'b';
        setGameOver(winner);
      } else {
        setGameOver('tie');
      }
    } else if ((remainingTime - 1) < 0) {
      console.log('THERE IS NO TIME TO MAKE A MOVE');
      console.log('Sorry youre not a winner... you will lose by clock F');
      return;
    } else {
      // re-use build on drop. since there's no more need for that functionality (for streamer)
      // you can just mangle it
      // but keep in mind there's going to be need to split up to share with viewer who could drag drop to vote 
      const startPos = {
        row: coords.startPosition.row,
        col: coords.startPosition.column
      }
      const peace = board[startPos.row][startPos.col];
      setTimeout(() => {
        setFlasher({
          startPosition: startPos,
          endPosition: coords.endPosition,
        });
        buildOnDrop(coords.endPosition.row, coords.endPosition.col, true, coords.promotion)(startPos, isRandom);
        aiWorker.terminate();
        setBlock(false);
        setClicksDisabled(peace.charAt(0) === (chatFirst ? 'b' : 'w'));
      }, totalTimeTaken < 1287 ? (1300 - totalTimeTaken) : 13);
    }
  };
  
  const gameChanger = useCallback((newVal) => {
    setGameOver((prev) => {
      if (prev !== newVal && !!newVal) {
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
    setPlayersRng(result.rng);
    setVotes(result.votes);
    if (result.gameConfig) {
      setTurnMins(result.gameConfig.turnMins);
      setStartTime(result.gameConfig.startTime);
      setOpponent(result.gameConfig.opponent);
      setStreamerAiEnabled(!!result.gameConfig.streamerAiEnabled);
      if (formRef.current) {
        formRef.current.turnMin.value = result.gameConfig.turnMins;
        formRef.current.votes.value = result.gameConfig.votes;
        formRef.current.aiMove.checked = !!result.gameConfig.streamerAiEnabled;
      }
    }
    setMoveHashTable(result?.moveHashTable || []);
    setCheck(result.check);
    gameChanger(result.gameOver);
    turnChanger(currentTurn);
    // re - enable clicking 
    const urColor = (result.chatFirst) ? 'b' : 'w'; 
    const clicksShouldBeDisabled = !!result.gameOver ? true : (currentTurn === urColor);
    setClicksDisabled(clicksShouldBeDisabled);
  };

  const resolveGameByClock = async (color) => {
    setGameOver(color);
  }

  // move, formRef, setGameOver, endGame, setPlayersRng, 
  const postMove = (move) => {
    const aiEnabledFromForm = !!formRef.current.aiMove.checked;
    const gameConfig = {
      startTime: new Date().getTime(),
      turnMins: formRef.current.turnMin.value,
      votes: formRef.current.votes.value,
      streamerAiEnabled: aiEnabledFromForm,
    };
    if (move.winner) {
      // winner = end game
      setGameOver(move.winner);
      endGame(move.winner);
    } else if (!move.piece && !move.startPosition && !move.endPosition) {
      // empty move start game 
      const userChoice = formRef.current.chatFirst.value;
      gameConfig.chatFirst = userChoice;
      gameConfig.opponent = move.username;
      setStreamerAiEnabled(aiEnabledFromForm);

      const rngVals = {
        chat: rng(3, 13, userChoice === 'white'),
        streamer: rng(3, 13, userChoice === 'black')
      }
      setBoardEval(0);
      setPlayersRng(rngVals);
      const rxsxlts = { 
        rng: rngVals,
        board: newBoard(),
        check: false,
        capturedPieces: { 'b': [], 'w': [] },
        chatFirst: userChoice === 'white',
        gameOver: false,
        id: id,
        time: '#',
        enPassantPawnPosition: false,
        moves: [],
        moveHashTable: {}, 
        votes: [],
        gameConfig: {
          chatFirst: userChoice === 'white',
          startTime: new Date().getTime(),
          turnMins: formRef.current.turnMin.value,
          votes: formRef.current.votes.value,
          streamerAiEnabled: aiEnabledFromForm,
          opponent: move.username
        }
      };
      setResults(rxsxlts);
      delete move.username;
      if (userChoice !== 'white') {
        console.log('chat is not first');
        setClicksDisabled(false);
      }
    } else {
      // execute the move
      const endPos = move.endPosition;
      const startPos = move.startPosition; 
      buildOnDrop(endPos.row, endPos.col, true, move.promoted)(startPos);
    }
  };

  const startGame = async (e, username = '') => {
    e.preventDefault();
    playSound('startGame');
    await postMove({ username });
  };

  const switchPlayerColor = useCallback(() => {
    if (!gameOver) return;
    setColorChoice((currentColor) => (currentColor === 'white' ? 'black' : 'white'));
  }, [gameOver]);

  const updateTurnMins = useCallback((direction) => {
    if (!gameOver) return;
    setTurnMins((mins) => {
      const numericMins = Number(mins);
      const currentIndex = TURN_MIN_OPTIONS.indexOf(numericMins);
      const safeIndex = currentIndex > -1 ? currentIndex : 0;
      const nextIndex = (safeIndex + direction + TURN_MIN_OPTIONS.length) % TURN_MIN_OPTIONS.length;
      const nextMins = TURN_MIN_OPTIONS[nextIndex];
      if (formRef.current) {
        formRef.current.turnMin.value = nextMins;
      }
      return nextMins;
    });
  }, [gameOver]);

  const toggleStreamerAi = useCallback(() => {
    setStreamerAiEnabled((enabled) => {
      const nextEnabled = !enabled;
      if (formRef.current) {
        formRef.current.aiMove.checked = nextEnabled;
      }
      return nextEnabled;
    });
  }, []);

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
  const buildOnDrop = (row, col, streamer, promo) => {
    return (e, isRandom = false) => {
      if (!streamer) e.preventDefault();
      // if streamer, e is just the start position right off the bat
      const startPosition = streamer ? e : JSON.parse(e.dataTransfer.getData('application/json'));
      console.log(startPosition);
      let removedPiece = board[row][col];
      if (gameOver) return; // avoiding race with clock and ai. 
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
      if (board[startPosition.row][startPosition.col] && board[startPosition.row][startPosition.col].substring(1) === 'Pawn' && Math.abs(col - startPosition.col) > 1) {
        setEnPassantPawnPosition({ row, col });
      } else { 
        // capturing en passant is permitted only on the turn immediately after the two square advance, so 
        // the next move clears whatever position was being tracked.
        setEnPassantPawnPosition(false);
      }
      // pawn upgrade logic - DISABLED via 'Streamer' option which is the ai flag 
      if (!streamer && isValidPromotion(board, row, col, startPosition) && board[startPosition.row][startPosition.col].substring(1) === 'Pawn') {
        console.log('BEAMER');
        setPromotion({ source: startPosition, dest: { row, col }});
        board[row][col] = board[startPosition.row][startPosition.col];
        board[startPosition.row][startPosition.col] = 0;
        setHilightedCells({});
        setBoard([...board]);
        setNewMove({
          startPosition,
          removedPiece,
          isRandom,
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
          setGameOver(isGameOver);
        }
        const hashResult = hashRepeatedThrice(board, moves.length, moveHashTable);
        console.log(hashResult);
        if (hashResult[0]) {
          isGameOver = 'tie';
          setGameOver(isGameOver);
        }
        setMoveHashTable(hashResult[1]);
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
          isRandom,
          startPosition
        };
        setMoves([
          thisIsTheMove,
          ...moves
        ]);
        setNewMove({});
        turnChanger(nextTurn); 
        // update check always 
        setCheck(check(board, nextTurn));
        saveGame({
          board,
          capturedPieces,
          chatFirst,
          enPassantPawnPosition,
          id,
          rng: playersRng,
          votes,
          check: inCheck,
          gameConfig: {
            startTime,
            chatFirst,
            opponent,
            turnMins: formRef.current.turnMin.value,
            votes: formRef.current.votes.value,
            streamerAiEnabled,
          },
          gameOver: isGameOver,
          moveHashTable: hashResult[1],
          moves: [
            thisIsTheMove,
            ...moves
          ],
          time: '#'
        });
      }
      // eval board
      setBoardEval(evaluateBoard(board));
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
      gameOver = turn;
    } else if (checkmate === 'tie') {
      gameOver = checkmate;
    }
    const hashResult = hashRepeatedThrice(board, moves.length, moveHashTable);
    if (hashResult[0]) {
      gameOver = 'tie';
      setGameOver(gameOver);
    }
    setMoveHashTable(hashResult[1]);
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
    // postMove(thisIsTheMove); this used to save the game, i'm just skipping for promotion fuck it shrudge 
    // todo: ^this will be a problem if the promotion ends the game.
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

  const { data, loading, error } = useFetch();

  useEffect(() => {
    setSoundAlert(true);
  }, []);

  useEffect(() => {
    if(!loading && data) {
      setResults(data);
    }
  }, [loading, data]);

  useEffect(() => {
    if (!gameOver && !block && turn === (chatFirst ? 'b' : 'w')) {
      aiMove(false);
    }
  }, [block, chatFirst, gameOver, streamerAiEnabled, turn]);
  
  if (loading && !data) return '';
  if (error) return <p>Error: {error.message}</p>;
  
  // row - index    column - i 
  return (
    <div className="enter" style={{ marginTop: '20px',  maxWidth: 'fit-content' }}>
      <AudioPlayer muted={useMuted[0]} sound={sound} />
      <div className='scale position' >
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
      <ConfigForm
        colorChoice={colorChoice}
        ref={formRef}
        streamerAiEnabled={streamerAiEnabled}
        turnMins={turnMins}
      />
      <MoveLog ai={aiMove} 
        aiEnabled={streamerAiEnabled}
        board={board}
        channel={id}
        chatFirst={chatFirst}
        colorChoice={colorChoice}
        enPassantPawnPosition={enPassantPawnPosition}
        gameOver={gameOver}
        hilighter={hilighter}
        initialVotes={votes}
        moves={moves}
        onSwitchPlayerColor={switchPlayerColor}
        onToggleAi={toggleStreamerAi}
        onUpdateTurnMins={updateTurnMins}
        opponent={opponent}
        postMove={postMove}
        setColorChoice={setColorChoice}
        setFlash={setFlasher}
        startGame={startGame}
        startTime={startTime}
        turnMins={turnMins}
        useMuted={useMuted}
      />
      <Meter currentValue={boardEval} />
      <Ticker gameOver={gameOver} />
      <Popup 
        isVisible={promotion}
        color={turn}
        onCancel={cancelPromote}
        onConfirm={promote}
      />
      <Popup
        isVisible={soundAlert}
        color={false}
        onCancel={()=>{ useMuted[1](true); setSoundAlert(false); }}
        onConfirm={()=>{useMuted[1](false); setSoundAlert(false); }}
      />
      <Ftr />
    </div>
  );
}

export default GameLayout;
