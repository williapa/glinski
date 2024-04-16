import React from 'react';

const em = "20px";
const yourTurn = ' ⏳';
const winner = ' 🏆';

// uses gameOver to store winner instead of true
// chatFirst === are you second?
const PlayerLabel = ({ turn, gameOver, ids, side }) => {
  // todo: these might need to be part of the class 
  const style = {
    position: "absolute",
    top: 16,
    wordBreak: "break-word",
  };
  let className = '';
  if (side === 'b') {
    style['left'] = em;
    className = 'left label';
  } else {
    className = 'right label';
  }
  let turnIcon = '';
  if (!gameOver) {
    if ((turn === side)) {
      turnIcon = yourTurn;
    }
  }

  return (
    <div
      className={className}
      style={style}
    >
      {ids[side]}
      <span style={{ fontSize: "76%" }}>
        {turnIcon}
        { gameOver === side ? <span className="floating">{winner} </span> : '' }
      </span>
    </div>
  )
};

export default PlayerLabel;
