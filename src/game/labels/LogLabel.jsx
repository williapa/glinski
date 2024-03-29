import React from 'react';
import QueenBee from '../../img/queen-bee.png'

const LogLabel = ({ gameOver, resetGame, turnCount }) => {
  
  return (
    <div className="moveLog-header">
      <span className="log">moves {turnCount ? <span className="count">({turnCount})</span>: ''}</span>
      { 
        !gameOver ? (
          <button style={{ position: "relative", top: "-2px" }} onClick={resetGame}>
            🔄
          </button>
        ) : ''
      }
      <img className="logo" src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    </div>
  );
};

export default LogLabel;
