import React from 'react';
import QueenBee from '../img/queen-bee.png';

const em = "1.25em";

const Ftr = () => {
  return (
    <div className="footer">
      <span>
        <span> Created by keyvalue & </span>
        <span className="footer-link" style={{ marginLeft: em, marginRight: em }}>🔑  💸</span>
        <a className="footer-link" href="https://twitter.com/keyvalue">
          <img style={{ width: '16px', position: 'relative', top: '4px' }} src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
        </a>
        <span className="footer-link" style={{ marginLeft: em, marginRight: em }}>🔀  🥱</span>
        <span> the shufflebored company </span>
      </span>
    </div>
  )
};

export default Ftr;
