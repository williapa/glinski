import React from 'react';

const TurnCounter = ({ chatFirst, turn, turnCount, gameOver }) => (
  <div
    style={{ position: "absolute", top: 10, /* right: turn === 'w' ? 10 : undefined, */ left: 10 }}
  >
    turn { turnCount } 
    { gameOver ? (chatFirst ? ' (you)' : ' (chat)') : (turn === 'b') ? (chatFirst) ? ' (Your move)' : " (chat's move)" : (chatFirst) ? " (you)": " (chat)" }
  </div>
);

export default TurnCounter;
