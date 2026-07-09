import React, { useState, useEffect } from 'react';
import drawConfetti from './drawConfetti';

// uses gameOver to store winner instead of true
// chatFirst === are you second?
const PlayerLabel = ({ check, turn, gameOver, ids, side }) => {
  // todo: these might need to be part of the class 
  const [labelClass, setLabelClass] = useState('label');
  
  useEffect(() => {
    let className = 'label';
    if (side === 'b') {
      className += ' left';
    } else {
      className += ' right';
    }
    if (!gameOver && (turn === side) && !!check) {
      className += ' check';
    }
    setLabelClass(className);
  }, [check, turn, gameOver, ids, side]);
  
  useEffect(() => {
    drawConfetti(gameOver);
  }, [gameOver]);
  return (
    <div
      className={labelClass}
    >
      {ids[side]}
      <span style={{ fontSize: "76%" }}>
        {check && (turn === side) && (!gameOver) ? ' (check) ' : ''}
      </span>
    </div>
  )
};

export default PlayerLabel;
