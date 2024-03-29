import './GameBoard.css';
import './GameLayout.css';
import pieceColor from '../util/pieceColor';
import { useEffect, useRef, useState } from 'react';
import Moves from '../moves';
import isFirstOrLast from '../util/isFirstOrLast';
import Popup from '../Popup/Popup';
import calculateRemainingTime from '../util/calculateRemainingTime';
import checkMate from '../util/checkMate';
import filterMoves from '../util/filterMoves';
import newBoard from '../util/newBoard';
import CapturedPieces from './CapturedPieces';
import BoardCell from './BoardCell';
import ConfigForm from './ConfigForm';
import MoveLog from './MoveLog';
import PlayerLabels from './labels/PlayerLabels';
import useFetch from "../hooks/useFetch";
import { useDisableClicks } from '../hooks/useDisableClicks';
import Ftr from "../footer/Ftr";
import Clocks from "./clock/Clocks";

const cellColors = ['beige', 'peach', 'brown']; // these correspond to class names they are not the real colors im sorry
const POLLING_INTERVAL = 10 * 1000;

function GameLayout({ id }) {
  const formRef = useRef(null);
  const { clickDisabled, setClicksDisabled } = useDisableClicks();
  const [chatFirst, setChatFirst] = useState(true);
  const [promotion, setPromotion] = useState(false);
  const [turn, setTurn] = useState('w');
  const [board, setBoard] = useState(newBoard());
  const [moves, setMoves] = useState([]);
  const [newMove, setNewMove] = useState({});
  const [hilightedCells, setHilightedCells] = useState({});
  const [enPassantPawnPosition, setEnPassantPawnPosition] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ b: [], w: [] });
  const [gameOver, setGameOver] = useState(true);
  const [turnMins, setTurnMins] = useState(.2);
  const [startTime, setStartTime] = useState(null);
  const [switchNextGame, setSwitchNextGame] = useState(false);
  const [poll, setPoll] = useState(null);

  const setResults = (result) => {
    const currentTurn = (result.moves.length % 2) ? 'b' : 'w';
    setBoard(result.board);
    setCapturedPieces(result.capturedPieces);
    setChatFirst(result.chatFirst);
    setEnPassantPawnPosition(result.enPassantPawnPosition);
    setMoves(result.moves);
    setTurn(currentTurn);
    if (result.gameConfig) {
      setTurnMins(result.gameConfig.turnMins);
      setStartTime(result.gameConfig.startTime);
      if (formRef.current) {
        formRef.current.turnMin.value = result.gameConfig.turnMins;
        formRef.current.votes.value = result.gameConfig.votes;
      }
      setSwitchNextGame(!!result.gameConfig.switchNextGame);
      
    }
    setGameOver(result.gameOver);
    // re - enable clicking 
    const urColor = (result.chatFirst) ? 'b' : 'w'; 
    setClicksDisabled(result.gameOver ? true : currentTurn !== urColor);
  };

  const resolveGameByClock = async (color) => {
    setGameOver(color);
    const postMoveResult = await fetch(`http://localhost:3000/${id}`, {
      method: 'POST',
      body: JSON.stringify({ checkTimeForWinner: color })
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
    // empty move = start game
    if (!move.piece && !move.startPosition && !move.endPosition) {
      // todo: loading state
      setResults({ 
        board: newBoard(), 
        capturedPieces: { 'b': [], 'w': [] },
        chatFirst: move.newChatFirst, 
        gameOver: false,
        enPassantPawnPosition: false,
        moves: [],
        gameConfig: {
          turnMins: formRef.current.turnMin.value,
          votes: formRef.current.votes.value,
          startTime: new Date().getTime(),
        }
      });

    } else if (gameOver) {
      // if you're receving a move with a piece/position and the game is over, 
      // something is wrong on the ui end, but the move shouldn't be posted so return
      console.error('something is wrong on the front end');
      return;
    }
    try {
      const gameConfig = {
        startTime: new Date().getTime(),
        turnMins: formRef.current.turnMin.value,
        votes: formRef.current.votes.value,
      };

      const postMoveResult = await fetch(`http://localhost:3000/${id}`, {
        method: 'POST',
        body: JSON.stringify({ move, gameConfig })
      });

      if (postMoveResult.status !== 200) {
        // now you can click again if you'd like 
        window.alert('something went wrong posting your move. please reload.');
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

  const startGame = async () => {
    let newChatFirst = chatFirst;
    if (switchNextGame) {
      newChatFirst = !chatFirst;
    }
    await postMove({ newChatFirst });
  };

  const hilightCells = (row, column, piece) => {
    const pieceClass = piece.substr(1);
    if (!Moves[pieceClass]) return;
    const moves = Moves[pieceClass](row,column,board,enPassantPawnPosition);

    // filter moves that would put the player in check
    const nonCheckCausingMoves = filterMoves(moves, board, [piece, { row, column }]);

    setHilightedCells(nonCheckCausingMoves);
  }

  // built so that you dont have to pass the board or the position or the setters into the piece
  const buildHilightCells = (x,y) => {
    return (piece) => {
      if (piece) {
        hilightCells(x,y,piece);
      } else {
        setHilightedCells({});
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
  const buildOnDrop = (row, col) => {
    return (e) => {
      e.preventDefault();
      const startPosition = JSON.parse(e.dataTransfer.getData('application/json'));
      let removedPiece = board[row][col];
      let gameOver = false;
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
        capturedPieces[removedPiece.charAt(0)].push(removedPiece);
        setCapturedPieces({ ...capturedPieces });
      }
      // check for en passant pawn move. This means the piece is a pawn and the column is changing by more than 1
      if (board[startPosition.row][startPosition.col].substring(1) === "Pawn" && Math.abs(col - startPosition.col) > 1) {
        setEnPassantPawnPosition({ row, col });
      } else {
        // capturing en passant is permitted only on the turn immediately after the two square advance, so 
        // the next move clears whatever position was being tracked.
        setEnPassantPawnPosition(false);
      }
      // pawn upgrade logic 
      if (isFirstOrLast(board, row, col) && board[startPosition.row][startPosition.col].substring(1) === 'Pawn') {
        setPromotion({ row, col });
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
        board[row][col] = board[startPosition.row][startPosition.col];
        board[startPosition.row][startPosition.col] = 0;
        setHilightedCells({});
        setBoard([...board]);
        const nextTurn = (turn === 'w' ? 'b' : 'w');
        setTurn(nextTurn);
        // check mate 
        if (checkMate(board, nextTurn, enPassantPawnPosition)) {
          window.alert(`check mate - ${nextTurn} loses`);
          gameOver = true;
        } 
        // add move to move log
        const thisIsTheMove = {
          time: Date.now(),
          piece: board[row][col],
          gameOver,
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
        postMove(thisIsTheMove);
      }
    }
  }

  const promote = (piece, row, column) => {
    const newTurn = turn === 'w' ? 'b' : 'w';
    setPromotion(false);
    board[row][column] = piece;
    setBoard([...board]);
    setTurn(newTurn);
    let gameOver = false;
    // check mate
    if (checkMate(board, newTurn, enPassantPawnPosition)) {
      window.alert(`checkmate - ${turn} wins`);
      gameOver = true;
    }
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
    postMove(thisIsTheMove);
  };

  const { data, loading, error, fetchData } = useFetch(`http://localhost:3000/${id}`);

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

    if (!loading && data.gameConfig) {
      console.log('not loading, setting data...');
      setResults(data);
      const blackRemainingTime = calculateRemainingTime(data.moves, data.gameConfig, 'b');
      const whiteRemainingTime = calculateRemainingTime(data.moves, data.gameConfig, 'w');
      console.log(blackRemainingTime);
      console.log(whiteRemainingTime);
      if (turn === (data.chatFirst ? 'w': 'b') && (chatFirst ? whiteRemainingTime : blackRemainingTime) < 0) {
        resolveGameByClock(turn === 'b' ? 'w' : 'b');
        if (poll) {
          clearTimeout(poll);
          setPoll(null);
        }
      } 
    }



  }, [loading]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  // row - index    column - i 
  return (
    <div style={{ marginTop: '20px',  maxWidth: 'fit-content' }}>
      { error ? <p> { error } </p> : '' }
      <div className="scale" >
      { board.map((row, index) => {
        return (
          <div key={`row${index}`} className='hex-row' style={{ marginLeft: Math.abs(index - 5) * 53 }}>
            { row.map((cell, i) => {
              // todo: marking this as important for when implementing client version 
              const movable = cell && cell.charAt(0) === turn;
              const rowColorOffset = index % 3;
              let cellColor = cellColors[(i + rowColorOffset) % 3];
              if (index > 5) {
                cellColor = cellColors[(10 - index + i) % 3];
              }
              const isDestination = hilightedCells[index] && hilightedCells[index].indexOf(i) > -1;
              return (
                <BoardCell
                  key={`cell${index},${i}`}
                  cell={cell}
                  cellColor={cellColor}
                  i={i}
                  index={index}
                  isDestination={isDestination}
                  movable={movable}
                  onDragOver={buildOnDragOver(index, i)}
                  onDrop={buildOnDrop(index, i)}
                  onStart={buildHilightCells(index,i)}
                  pieceColor={pieceColor(cell)}
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
        gameOver={gameOver}
        id={id}
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
      <ConfigForm clickDisabled={clickDisabled}
        gameOver={gameOver}
        ref={formRef}
      />
      <MoveLog gameOver={gameOver} 
        moves={moves}
        startGame={startGame}
        startTime={startTime}
      />
      <Popup 
        isVisible={promotion}
        color={turn}
        onConfirm={promote}
      />
      <Ftr />
    </div>
  );
}

export default GameLayout;
