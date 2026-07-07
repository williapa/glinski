import React, { useEffect, useRef } from 'react';
import LogLabel from './labels/LogLabel';
import MoveLogConfigControls from './controls/MoveLogConfigControls';
import logPieceMap from '../../util/logPieceMap';
import rowColToLetterCol from '../../util/rowColToLetterCol';

function SoloMoveLog({
  gameOver,
  isGameActive,
  moves,
  onHover,
  onStartGame,
  onSwitchPlayerColor,
  onUpdateTurnMins,
  logPlayerColor,
  nextPlayerColor,
  startTime,
  turnMins,
}) {
  const topRef = useRef(null);
  const userSide = logPlayerColor === 'black' ? 'b' : 'w';
  const canConfigureGame = !isGameActive || !!gameOver;
  const displayedPlayerColor = canConfigureGame ? nextPlayerColor : logPlayerColor;
  const displayedAiColor = displayedPlayerColor === 'black' ? 'white' : 'black';
  const playerColorIsBlack = nextPlayerColor === 'black';

  const resolveMovePiece = (move) => {
    if (typeof move?.piece === 'string') return move.piece;
    if (typeof move?.promotion === 'string') return move.promotion;
    return null;
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollTo({ top: topRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [gameOver, isGameActive, moves]);

  return (
    <div className="moveLog">
      <LogLabel gameOver={gameOver} useMuted={[false, () => {}]} />
      <ul ref={topRef} className="moveLog-list">
        {isGameActive ? (
          <li className="moveLog-item">
            <span className="timeLabel">{new Date(startTime).toLocaleTimeString()} </span>
            <span>You are {displayedPlayerColor}. AI is {displayedAiColor}.</span>
          </li>
        ) : (
          <li className="moveLog-item">
            <span>Click start game to begin. You are {displayedPlayerColor}. AI is {displayedAiColor}.</span>
          </li>
        )}
        {moves
          .slice()
          .reverse()
          .map((move, index) => {
            const piece = resolveMovePiece(move);
            if (!piece) return null;

            return (
              <li
                key={`${move.time}-${index}`}
                className={`moveLog-item ${piece.charAt(0)}`}
                onMouseEnter={() => onHover(move.startPosition, move.endPosition)}
              >
                <span className="timeLabel">{new Date(move.time).toLocaleTimeString()} </span>
                <span>{piece.charAt(0) === userSide ? 'You' : 'AI'} played </span>
                {move.promoted ? <span>promotion to </span> : ''}
                <span>{logPieceMap[piece]} </span>
                <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
                <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
                {move.removedPiece ? <span> taking {logPieceMap[move.removedPiece]}</span> : ''}
                {move.isRandom ? <span> 🎲</span> : ''}
                <span>.</span>
              </li>
            );
          })}
        {(gameOver === 'b' || gameOver === 'w' || gameOver === 'tie') ? (
          <li className="moveLog-item">
            <i>{{ 'w': 'White won!', 'b': 'Black won!', tie: 'Draw.' }[gameOver]}</i>
          </li>
        ) : null}
      </ul>
      <MoveLogConfigControls
        canConfigureGame={canConfigureGame}
        isGameActive={isGameActive}
        onStartGame={onStartGame}
        onSwitchPlayerColor={onSwitchPlayerColor}
        onUpdateTurnMins={onUpdateTurnMins}
        playerColorIsBlack={playerColorIsBlack}
        turnMins={turnMins}
      />
    </div>
  );
}

export default SoloMoveLog;
