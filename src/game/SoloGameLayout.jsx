import { useCallback, useEffect, useState } from 'react';
import pieceColor from '../util/pieceColor.js';
import Moves from '../moves/index.js';
import Popup from './popup/Popup.jsx';
import calculateRemainingTime from '../util/calculateRemainingTime.js';
import check from '../util/check.js';
import checkMate from '../util/checkMate.js';
import filterMoves from '../util/filterMoves.js';
import isValidPromotion from '../util/isValidPromotion.js';
import newBoard from '../util/newBoard.js';
import CapturedPieces from './panels/CapturedPieces.jsx';
import BoardCell from './BoardCell.jsx';
import PlayerLabel from './panels/labels/PlayerLabel.jsx';
import SoloMoveLog from './panels/SoloMoveLog.jsx';
import Ftr from '../footer/Ftr.jsx';
import Clocks from './panels/labels/clock/Clocks.jsx';
import AudioPlayer from '../audio/AudioPlayer.jsx';
import Meter from './panels/labels/meter/Meter.jsx';
import hashRepeatedThrice from '../util/hashRepeatedThrice.js';
import evaluateBoard from '../worker/ai/evaluateBoard.js';
import { useDisableClicks } from '../hooks/useDisableClicks.js';
import './GameBoard.css';
import './GameLayout.css';

const cellColors = ['beige', 'peach', 'brown'];
const TURN_MINS = 2;

const resolveSides = (colorChoice) => ({
  userSide: colorChoice === 'black' ? 'b' : 'w',
  aiSide: colorChoice === 'black' ? 'w' : 'b',
});

const createInitialFlash = () => ({
  startPosition: { row: -1, col: -1 },
  endPosition: { row: -1, col: -1 },
  keyCount: 0,
});

const createInitialState = (colorChoice) => {
  const { userSide, aiSide } = resolveSides(colorChoice);

  return {
    board: newBoard(),
    boardEval: 0,
    capturedPieces: { b: [], w: [] },
    enPassantPawnPosition: false,
    gameOver: false,
    inCheck: false,
    moveHashTable: {},
    moves: [],
    newMove: {},
    startTime: Date.now(),
    turn: colorChoice === 'black' ? aiSide : userSide,
  };
};

function SoloGameLayout() {
  const { setClicksDisabled } = useDisableClicks();
  const [flash, setFlash] = useState(createInitialFlash);
  const [boardEval, setBoardEval] = useState(0);
  const [inCheck, setCheck] = useState(false);
  const [promotion, setPromotion] = useState(false);
  const [turn, setTurn] = useState('w');
  const [board, setBoard] = useState(newBoard());
  const [moves, setMoves] = useState([]);
  const [moveHashTable, setMoveHashTable] = useState({});
  const [newMove, setNewMove] = useState({});
  const [hilightedCells, setHilightedCells] = useState({});
  const [enPassantPawnPosition, setEnPassantPawnPosition] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState({ b: [], w: [] });
  const [gameOver, setGameOver] = useState(false);
  const [useMuted, setUseMuted] = useState(false);
  const [sound, playSound] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [block, setBlock] = useState(false);
  const [soundAlert, setSoundAlert] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);
  const [turnMins, setTurnMins] = useState(TURN_MINS);
  const [activePlayerColor, setActivePlayerColor] = useState('white');
  const [nextPlayerColor, setNextPlayerColor] = useState('white');

  const { userSide, aiSide } = resolveSides(activePlayerColor);
  const panelPlayerColor = isGameActive && !gameOver ? activePlayerColor : nextPlayerColor;
  const { userSide: panelUserSide } = resolveSides(panelPlayerColor);
  const playerCanMove = isGameActive && !block && !gameOver && !promotion && turn === userSide;
  const playerIds = {
    b: panelUserSide === 'b' ? 'You' : 'AI',
    w: panelUserSide === 'w' ? 'You' : 'AI',
  };

  const setFlasher = (newFlash) => {
    setFlash((prev) => ({
      ...newFlash,
      keyCount: prev.keyCount + 1,
    }));
  };

  const gameChanger = useCallback((newVal) => {
    setGameOver((prev) => {
      if (prev !== newVal && !!newVal) {
        if (newVal === userSide) {
          playSound('youWin');
        } else if (newVal === aiSide) {
          playSound('youLose');
        } else if (newVal === 'tie') {
          playSound('draw');
        }
      }
      return newVal;
    });
  }, [aiSide, userSide]);

  const turnChanger = useCallback((newVal) => {
    setTurn((previousTurn) => {
      if (previousTurn !== newVal && !gameOver && newVal === userSide) {
        playSound('yourMove');
      }
      return newVal;
    });
  }, [gameOver, userSide]);

  const resetGame = useCallback(() => {
    const selectedPlayerColor = nextPlayerColor;
    const initialState = createInitialState(selectedPlayerColor);
    setActivePlayerColor(selectedPlayerColor);
    setBoard(initialState.board);
    setBoardEval(initialState.boardEval);
    setCapturedPieces(initialState.capturedPieces);
    setEnPassantPawnPosition(initialState.enPassantPawnPosition);
    setFlash(createInitialFlash());
    setCheck(initialState.inCheck);
    setMoveHashTable(initialState.moveHashTable);
    setMoves(initialState.moves);
    setNewMove(initialState.newMove);
    setPromotion(false);
    setHilightedCells({});
    setBlock(false);
    setIsGameActive(true);
    setStartTime(initialState.startTime);
    setTurn(initialState.turn);
    gameChanger(initialState.gameOver);
    playSound('startGame');
  }, [gameChanger, nextPlayerColor]);

  const stopGame = useCallback(() => {
    if (!isGameActive || gameOver) return;
    setIsGameActive(false);
    setGameOver(true);
    setPromotion(false);
    setHilightedCells({});
    setBlock(false);
    setClicksDisabled(true);
  }, [gameOver, isGameActive, setClicksDisabled]);

  const switchPlayerColor = useCallback(() => {
    if (isGameActive && !gameOver) return;
    setNextPlayerColor((currentColor) => (currentColor === 'white' ? 'black' : 'white'));
  }, [gameOver, isGameActive]);

  const updateTurnMins = useCallback((nextMins) => {
    if (isGameActive && !gameOver) return;
    setTurnMins(nextMins);
  }, [gameOver, isGameActive]);

  const hilightCells = (row, column, piece) => {
    const pieceClass = piece.substr(1);
    if (!Moves[pieceClass]) return;
    const availableMoves = Moves[pieceClass](row, column, board, enPassantPawnPosition);
    const nonCheckCausingMoves = filterMoves(availableMoves, board, [piece, { row, column }]);
    setHilightedCells(nonCheckCausingMoves);
  };

  const buildHilightCells = (x, y) => (piece) => {
    if (piece) {
      playSound('pickUp');
      hilightCells(x, y, piece);
    } else {
      setHilightedCells({});
      if (turn === userSide) {
        playSound('putDownCancel');
      }
    }
  };

  const buildOnDragOver = (row, col) => (e) => {
    if (hilightedCells[row] && hilightedCells[row].indexOf(col) > -1) {
      e.preventDefault();
    }
  };

  const buildOnDrop = useCallback((row, col, streamer = false, promo = false) => {
    return (e, isRandom = false) => {
      if (!streamer) e.preventDefault();
      const startPosition = streamer ? e : JSON.parse(e.dataTransfer.getData('application/json'));
      let removedPiece = board[row][col];
      if (gameOver) return;

      let isGameOver = false;
      if (enPassantPawnPosition) {
        const dir = turn === 'w' ? 1 : -1;
        if (enPassantPawnPosition.row === row && enPassantPawnPosition.col === col + dir) {
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

      if (
        board[startPosition.row][startPosition.col] &&
        board[startPosition.row][startPosition.col].substring(1) === 'Pawn' &&
        Math.abs(col - startPosition.col) > 1
      ) {
        setEnPassantPawnPosition({ row, col });
      } else {
        setEnPassantPawnPosition(false);
      }

      if (
        !streamer &&
        isValidPromotion(board, row, col, startPosition) &&
        board[startPosition.row][startPosition.col].substring(1) === 'Pawn'
      ) {
        setPromotion({ source: startPosition, dest: { row, col } });
        board[row][col] = board[startPosition.row][startPosition.col];
        board[startPosition.row][startPosition.col] = 0;
        setHilightedCells({});
        setBoard([...board]);
        setNewMove({
          startPosition,
          removedPiece,
          isRandom,
          endPosition: { row, col },
          promoted: true,
        });
        return;
      }

      const finalPiece = promo || board[startPosition.row][startPosition.col];
      board[row][col] = finalPiece;
      board[startPosition.row][startPosition.col] = 0;
      setHilightedCells({});
      setBoard([...board]);
      const nextTurn = turn === 'w' ? 'b' : 'w';
      const checkmate = checkMate(board, nextTurn, enPassantPawnPosition);
      if (checkmate && checkmate !== 'tie') {
        isGameOver = turn;
      } else if (checkmate === 'tie') {
        isGameOver = 'tie';
      }
      const hashResult = hashRepeatedThrice(board, moves.length, moveHashTable);
      if (hashResult[0]) {
        isGameOver = 'tie';
      }
      setMoveHashTable(hashResult[1]);

      const thisIsTheMove = {
        time: Date.now(),
        piece: finalPiece,
        promoted: !!promo,
        gameOver: isGameOver,
        removedPiece,
        endPosition: { row, col },
        isRandom,
        startPosition,
      };

      setMoves([
        thisIsTheMove,
        ...moves,
      ]);
      setNewMove({});
      turnChanger(nextTurn);
      setCheck(check(board, nextTurn));
      setBoardEval(evaluateBoard(board));
      if (isGameOver) {
        gameChanger(isGameOver);
      }
    };
  }, [
    board,
    capturedPieces,
    enPassantPawnPosition,
    gameChanger,
    gameOver,
    moveHashTable,
    moves,
    turn,
    turnChanger,
  ]);

  const aiMove = useCallback(async () => {
    setBlock(true);
    const aiWorker = new Worker(new URL('../worker/ai/worker.js', import.meta.url), {
      type: 'module',
    });
    const moveStartedAt = Date.now();

    try {
      const [moveValue, coords, isRandom] = await new Promise((resolve) => {
        aiWorker.addEventListener('message', (message) => {
          resolve(message.data);
        });
        aiWorker.onerror = (e) => {
          console.error('Worker error:', e);
        };
        aiWorker.postMessage({
          board,
          capturedPieces,
          chatFirst: aiSide === 'w',
          enPassantPawnPosition,
          isChatsMove: true,
          halfMoves: moves.length,
        });
      });

      const totalTimeTaken = Date.now() - moveStartedAt;
      console.log(moveValue);
      console.log(coords);
      const remainingTime = calculateRemainingTime(moves, { startTime, turnMins }, aiSide);

      if (!coords) {
        gameChanger(inCheck ? userSide : 'tie');
        setBlock(false);
        return;
      }
      if ((remainingTime - 1) < 0) {
        gameChanger(userSide);
        setBlock(false);
        return;
      }

      const startPos = {
        row: coords.startPosition.row,
        col: coords.startPosition.column,
      };
      setTimeout(() => {
        setFlasher({
          startPosition: startPos,
          endPosition: coords.endPosition,
        });
        buildOnDrop(coords.endPosition.row, coords.endPosition.col, true, coords.promotion)(startPos, isRandom);
        setBlock(false);
      }, totalTimeTaken < 1287 ? (1300 - totalTimeTaken) : 13);
    } finally {
      aiWorker.terminate();
    }
  }, [aiSide, board, buildOnDrop, capturedPieces, enPassantPawnPosition, gameChanger, inCheck, moves, startTime, turnMins, userSide]);

  const promote = (piece, row, column) => {
    const newTurn = turn === 'w' ? 'b' : 'w';
    setPromotion(false);
    board[row][column] = piece;
    setBoard([...board]);
    let nextGameOver = false;
    const checkmate = checkMate(board, newTurn, enPassantPawnPosition);
    if (checkmate && checkmate !== 'tie') {
      nextGameOver = turn;
    } else if (checkmate === 'tie') {
      nextGameOver = 'tie';
    }
    const hashResult = hashRepeatedThrice(board, moves.length, moveHashTable);
    if (hashResult[0]) {
      nextGameOver = 'tie';
    }
    setMoveHashTable(hashResult[1]);
    newMove.promoted = true;
    const thisIsTheMove = {
      ...newMove,
      piece,
      gameOver: nextGameOver,
      time: Date.now(),
    };
    setMoves([
      thisIsTheMove,
      ...moves,
    ]);
    setNewMove({});
    turnChanger(newTurn);
    playSound('putDownPromote');
    setCheck(check(board, newTurn));
    setBoardEval(evaluateBoard(board));
    if (nextGameOver) {
      gameChanger(nextGameOver);
    }
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
  };

  useEffect(() => {
    setSoundAlert(true);
  }, []);

  useEffect(() => {
    setClicksDisabled(!isGameActive || block || !!gameOver || !!promotion || turn === aiSide);
  }, [aiSide, block, gameOver, isGameActive, promotion, setClicksDisabled, turn]);

  useEffect(() => {
    if (isGameActive && !gameOver && !block && turn === aiSide && !promotion) {
      aiMove();
    }
  }, [aiMove, aiSide, block, gameOver, isGameActive, promotion, turn]);

  return (
    <div className="enter" style={{ marginTop: '20px', maxWidth: 'fit-content' }}>
      <AudioPlayer muted={useMuted} sound={sound} />
      <div className="scale position">
        {board.map((row, index) => (
          <div key={`row${index}`} className="hex-row" style={{ marginLeft: Math.abs(index - 5) * 53 }}>
            {row.map((cell, i) => {
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
                  from={flash.startPosition.row === index && flash.startPosition.col === i}
                  i={i}
                  index={index}
                  isDestination={isDestination}
                  movable={movable}
                  onDragOver={buildOnDragOver(index, i)}
                  onDrop={buildOnDrop(index, i)}
                  onStart={buildHilightCells(index, i)}
                  pieceColor={pieceColor(cell)}
                  playerCanMove={playerCanMove}
                  playerSide={userSide}
                  to={flash.endPosition.row === index && flash.endPosition.col === i}
                  turn={turn}
                  chatFirst={false}
                />
              );
            })}
          </div>
        ))}
      </div>
      <PlayerLabel
        check={inCheck}
        turn={turn}
        gameOver={gameOver}
        ids={playerIds}
        side="b"
      />
      <PlayerLabel
        check={inCheck}
        turn={turn}
        gameOver={gameOver}
        ids={playerIds}
        side="w"
      />
      <Clocks
        chatFirst={false}
        endGame={gameChanger}
        gameOver={!isGameActive || gameOver}
        moves={moves}
        startTime={startTime}
        turn={turn}
        turnMins={turnMins}
      />
      <CapturedPieces capturedPieces={capturedPieces} />
      <SoloMoveLog
        gameOver={gameOver}
        isGameActive={isGameActive && !gameOver}
        moves={moves}
        onHover={(startPosition, endPosition) => setFlasher({ startPosition, endPosition })}
        onStartGame={resetGame}
        onStopGame={stopGame}
        onSwitchPlayerColor={switchPlayerColor}
        onUpdateTurnMins={updateTurnMins}
        logPlayerColor={activePlayerColor}
        nextPlayerColor={nextPlayerColor}
        startTime={startTime}
        turnMins={turnMins}
      />
      <Meter currentValue={boardEval} />
      <Popup
        isVisible={promotion}
        color={turn}
        onCancel={cancelPromote}
        onConfirm={promote}
      />
      <Popup
        isVisible={soundAlert}
        color={false}
        onCancel={() => { setUseMuted(true); setSoundAlert(false); }}
        onConfirm={() => { setUseMuted(false); setSoundAlert(false); }}
      />
      <Ftr />
    </div>
  );
}

export default SoloGameLayout;
