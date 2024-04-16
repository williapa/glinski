import React from 'react';
import QueenBee from '../../img/queen-bee.png'
import './LogLabel.css';

const LogLabel = ({ gameOver, useMuted, startGame, turnCount }) => {

  const [muted, setMuted] = useMuted;

  const toggleMuted = () => {
    setMuted((prev) => !prev);
  }
  
  return (
    <div className="moveLog-header">
      <span className="log">log {turnCount ? <span className="count">({turnCount})</span>: ''}</span>
      {
        gameOver ? (
          <button className="newGame" onClick={startGame}>
            ▶️
          </button>
        ) : ''
      }
      {
        <button className="volume" onClick={toggleMuted}>
          {muted ? '🔇': '🔊' }
        </button>
      }
      <img className="logo" src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    </div>
  );
};

export default LogLabel;
