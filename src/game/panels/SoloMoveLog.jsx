import React, { useEffect, useRef } from 'react';
import LogLabel from './labels/LogLabel';
import logPieceMap from '../../util/logPieceMap';
import rowColToLetterCol from '../../util/rowColToLetterCol';

const USER_SIDE = 'w';

function SoloMoveLog({ gameOver, isGameActive, moves, onHover, startTime }) {
  const topRef = useRef(null);

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
            <span>You are white. AI is black.</span>
          </li>
        ) : (
          <li className="moveLog-item">
            <span>Click start game to begin. You are white. AI is black.</span>
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
                <span>{piece.charAt(0) === USER_SIDE ? 'You' : 'AI'} played </span>
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
            <i>{{ w: 'You win!', b: 'AI wins.', tie: 'Draw.' }[gameOver]}</i>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default SoloMoveLog;
