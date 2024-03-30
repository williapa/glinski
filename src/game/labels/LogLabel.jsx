import React from 'react';
import QueenBee from '../../img/queen-bee.png'

const LogLabel = ({ turnCount }) => {
  
  return (
    <div className="moveLog-header">
      <span className="log">moves {turnCount ? <span className="count">({turnCount})</span>: ''}</span>
      <img className="logo" src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    </div>
  );
};

export default LogLabel;
