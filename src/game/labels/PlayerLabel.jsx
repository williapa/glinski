import React from 'react';

const margin = "1em";

const opponentTurn = ' ⏳';
const winner = ' 🏆';
const yourTurn = ' 🟢';

// uses gameOver to store winner instead of true
// chatFirst === are you second?
const PlayerLabel = ({ chatFirst, turn, gameOver, ids, side }) => {
  const style = {
    position: "absolute",
    top: 10
  };
  style[side === 'b' ? 'left': 'right'] = margin;
  let turnIcon = '';
  if (!gameOver) {
    if ((turn === side)) {
      turnIcon = chatFirst && ( turn === 'b') ? yourTurn : opponentTurn;
    }
  }

  return (
    <div
      style={style}
    >
      {ids[side]}
      {turnIcon}
      { gameOver === side ? winner : '' }
    </div>
  )
};

export default PlayerLabel;
