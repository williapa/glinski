import './GameBoard.css';
import './GameLayout.css';
import pieceColor from '../util/pieceColor';
import { useEffect, useRef, useState } from 'react';
import Moves from '../moves';
import isFirstOrLast from '../util/isFirstOrLast';
import Popup from '../Popup/Popup';
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

const cellColors = ['beige', 'peach', 'brown']; // these correspond to class names they are not the real colors im sorry

function GameLayout({ id }) {
  const formRef = useRef(null);
  const { setClicksDisabled } = useDisableClicks();
  const [chatFirst, setChatFirst] = useState(true);
  const [promotion, setPromotion] = useState(false);
  const [turn, setTurn] = useState('w');
  const [board, setBoard] = useState(newBoard());
  const [moves, setMoves] = useState([]);
  const [newMove, setNewMove] = useState({});
  const [hilightedCells, setHilightedCells] = useState({});
  const [enPassantPawnPosition, setEnPassantPawnPosition] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ b: [], w: [] });
  const [gameOver, setGameOver] = useState(false);
  const [poll, setPoll] = useState(null);

  const ids = {
    'b': chatFirst ? id : 'chat',
    'w': chatFirst ? 'chat': id
  };

  // todo: catch error and re-get the board
  // todo: disable everything until result, or board is re-gotten. 
  const postMove = async (move) => {
    // if you could post a move then you clicked. I'm cutting you off. 
    if (!move.piece && !move.startPosition && !move.endPosition) {
      setBoard(newBoard());
      setMoves([]);
      setEnPassantPawnPosition(false);
      setGameOver(false);
      setCapturedPieces({ 'b': [], 'w': [] });
      setTurn('w');
    } else if (gameOver) {
      return;
    }
    setClicksDisabled(true);
    try {
      const postMoveResult = await fetch(`http://localhost:3000/${id}`, {
        method: 'POST',
        body: JSON.stringify({ move })
      });
      console.log(postMoveResult);
      if (postMoveResult.status !== 200) {
        // now you can click again if you'd like 
        window.alert('something went wrong posting your move. please reload.');
      } else {
        const result = await postMoveResult.json();
        // todo: this will take a long time, but contain chat's move as the response 
        // set those values here 
        setBoard(result.board);
        setCapturedPieces(result.capturedPieces);
        setChatFirst(result.chatFirst);
        setGameOver(result.gameOver);
        setMoves(result.moves);
        setTurn((result.moves.length % 2) ? 'b' : 'w');
        setEnPassantPawnPosition(result.enPassantPawnPosition);
      }
    } catch (e) {
      window.alert("error: ", e);
    }
    // re - enable clicking 
    setClicksDisabled(false);
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
    if (data && !data.gameOver && !poll && (data.chatFirst === !(data.moves.length % 2))) {
      console.log("setting timeout");
      const newPoll = setTimeout(async () => {
        await fetchData();
        setPoll(null);
      }, 15000);
      setPoll(newPoll);
    } else if (data && poll && (data.gameOver || (data.chatFirst === (data.moves.length % 2)))) {
      console.log("clearing timeout because the data says its ok");
      clearTimeout(poll);
      setPoll(null);
      setClicksDisabled(false);
    }
    if (data && data.board) {
      setBoard(data.board);
    }
    if (data && data.moves) {
      setMoves(data.moves);
      setTurn((data.moves.length % 2) ? 'b' : 'w');
    }
    if (data) {
      setGameOver(data.gameOver);
      setChatFirst(data.chatFirst);
      setEnPassantPawnPosition(data.enPassantPawnPosition);
      setCapturedPieces(data.capturedPieces);
      // could look at color for last move but this is more direct
      let turn = !!(data.moves.length % 2) ? 'b' : 'w';
      const yourColor = (data.chatFirst) ? 'b' : 'w'; 
      setClicksDisabled(turn !== yourColor)
      setTurn(turn);
    }

  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // row - index    column - i 
  return (
    <div style={{ marginTop: '20px',  maxWidth: 'fit-content' }}>
      <div className="scale" >
      { board.map((row, index) => {
        return (
          <div key={`row${index}`} className='hex-row' style={{ marginLeft: Math.abs(index - 5) * 53 }}>
            { row.map((cell, i) => {
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
      <CapturedPieces capturedPieces={capturedPieces} />
      <PlayerLabels chatFirst={chatFirst} turn={turn} gameOver={gameOver} ids={ids} />
      <Popup isVisible={promotion} color={turn} onConfirm={promote} />
      <ConfigForm ref={formRef} />
      <MoveLog gameOver={gameOver} moves={moves} startGame={() => postMove({}) } />
      <Ftr />
    </div>
  );
}

export default GameLayout;
