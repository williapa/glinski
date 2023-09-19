import React from 'react';
import rowColToLetterCol from '../util/rowColToLetterCol';
import pieceMap from '../util/pieceMap';

const MoveLog = ({ gameOver, moves}) => {
  // Inline styles object
  const styles = {
    container: {
      overflowY: 'auto',
      maxHeight: '400px',
      border: '1px solid black',
      textAlign: 'left' // Ensure text is aligned left
    },
    list: {
      listStyleType: 'none',
      padding: 0,
      margin: 0 // Remove default margin to ensure left alignment
    },
    listItem: {
      textAlign: 'left' // Ensure text in each list item is aligned left
    }
  };
  // todo: compute position better
  return (
    <div style={styles.container}>
      <ul style={styles.list}>
        { gameOver && moves.length ? {'w': 'white', 'b': 'black' }[moves[0].piece.charAt(0)] + ' wins!' : ''}
        {moves.map((move, index) => (
          <li key={index} style={styles.listItem}>
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
};

export default MoveLog;
