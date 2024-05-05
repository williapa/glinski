import React, { useEffect } from 'react';
import freddyKonfeddy from '../freddyKonfeddy';

const em = "20px";
const yourTurn = ' ⏳';
const winner = ' 🏆';

// uses gameOver to store winner instead of true
// chatFirst === are you second?
const PlayerLabel = ({ check, turn, gameOver, ids, side }) => {
  // todo: these might need to be part of the class 
  const style = {};
  let className = '';
  if (side === 'b') {
    className = 'left label';
  } else {
    className = 'right label';
  }
  let turnIcon = '';
  if (!gameOver) {
    if ((turn === side)) {
      turnIcon = yourTurn;
      if (check) {
        className += ' check';
      }
    }
  }

  useEffect(() => {
    freddyKonfeddy(gameOver);
  }, [gameOver]);
  return (
    <div
      className={className}
    >
      {ids[side]}
      <span style={{ fontSize: "76%" }}>
        {turnIcon}
        {check && (turn === side) && (!gameOver) ? ' (check) ' : ''}
        { gameOver === side ? <span className="floating">{winner} </span> : '' }
      </span>
    </div>
  )
};

export default PlayerLabel;
