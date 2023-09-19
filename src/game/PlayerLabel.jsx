import React from 'react';

const PlayerLabel = ({ chatFirst, turn, gameOver}) => (
  <div
    style={{ position: "absolute", top: 10, /* left: turn === 'w' ? 10 : undefined, */ right: 10 }}
  >
    { gameOver ? (chatFirst ? '(chat)' : '(you)') : (turn === 'w') ? (chatFirst) ? `(chat's move)`: '(your move)' : (chatFirst) ? '(chat)': "(you)" }
  </div>
);

export default PlayerLabel;
