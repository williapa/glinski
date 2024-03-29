import React from 'react';

const em = "1.25em";

const Ftr = () => {
  return (
    <div className="footer">
      <span>
        <span> Created by keyvalue & </span>
        <span className="footer-link" style={{ marginLeft: em, marginRight: em }}>🔑  💸</span>
        <a className="footer-link" href="https://twitter.com/keyvalue">x</a>
        <span className="footer-link" style={{ marginLeft: em, marginRight: em }}>🔀  🥱</span>
        <span> the shufflebored company </span>
      </span>
    </div>
  )
};

export default Ftr;
