import React from 'react';

const em = "1.25em";

const Ftr = () => {
  return (
    <div className="footer">
      <span>
        <span style={{ marginRight: em }}> Copyright © 2024 </span>
        <a className="footer-link" href="https://github.com/williapa/honeycomb-client">gh</a>
        <span style={{ marginLeft: em, marginRight: em }}>🔑  💸</span>
        <a className="footer-link" href="https://twitter.com/keyvalue">x</a>
        <span style={{ marginLeft: em, marginRight: em }}>🔀  🥱</span>
        <a className="footer-link" href="https://youtube.com/@prodbykeyvalue">yt</a>
        <span style={{ marginLeft: em }}> keyvalue & shufflebored </span>
      </span>
    </div>
  )
};

export default Ftr;
