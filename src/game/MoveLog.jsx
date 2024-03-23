import React from 'react';
import rowColToLetterCol from '../util/rowColToLetterCol';
import pieceMap from '../util/pieceMap';
import LogLabel from './labels/LogLabel';

const MoveLog = ({ gameOver, moves, startGame }) => (
  <div className="moveLog">
    <LogLabel turnCount={moves.length} />
    <ul className="moveLog-list">
      {
        gameOver ? (
          <li className="moveLog-item">
            <button style={{ width: '100%', height: '2em' }} onClick={startGame}>
              new game
            </button>
          </li>
        ) : ''
      }
      { gameOver && moves.length ? 
        (
          <li key="f" className="moveLog-item">
            {
              {'w': 'white', 'b': 'black' }[moves[0].piece.charAt(0)] + ' wins!'
            }
          </li>
        ) : ''
      }
      {moves.map((move, index) => (
        <li key={index} className="moveLog-item">
          <span>{new Date(move.time).toLocaleTimeString()}: </span>
          <span>{pieceMap[move.piece]} </span>
          from <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
          to <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
          {move.removedPiece ? <span> capturing {pieceMap[move.removedPiece]}</span> : ''}
          {move.promoted ? <span> (Promoted)</span> : ''}.
        </li>
      ))}
    </ul>
  </div>
);

export default MoveLog;
