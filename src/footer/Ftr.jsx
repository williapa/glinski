import React from 'react';
import QueenBee from '../img/queen-bee.png';

const em = "1.25em";

const Ftr = () => {
  return (
    <div className="footer">
      <span>
        <span> Designed by keyvalue </span>
        <a className="footer-link" href="https://twitter.com/keyvalue">
          <img style={{ width: '16px', position: 'relative', top: '4px', marginLeft: em, marginRight: em }} src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
        </a>
        <span> in Henderson, Nevada </span>
      </span>
    </div>
  )
};

export default Ftr;
