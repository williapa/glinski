import React from 'react';
import QueenBee from '../../img/queen-bee.png'
import './LogLabel.css';

const LogLabel = ({ gameOver, useMuted, startGame, turnCount }) => {

  const [muted, setMuted] = useMuted;

  const toggleMuted = () => {
    setMuted((prev) => !prev);
  }
  // glinsk.ai glinsk.io glins.ki glins.ke
  return (
    <div className="moveLog-header">
      <span className="log"><span id="findme">Glins.ki</span> {/*turnCount ? <span className="count">({turnCount})</span>: '' */}</span>
      {
        <button style={{ display: 'none' }} className="volume" onClick={toggleMuted}>
          {muted ? '🔇': '🔊' }
        </button>
      }
      <img className="logo" src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    </div>
  );
};

export default LogLabel;
