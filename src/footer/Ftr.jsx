import React from 'react';
// rgb(173 117 187)rgb(180, 84, 255) or white
export default function Ftr () {
  return (
    <div className="footer">
      <span>
        <span> Designed by <b style={{marginLeft: '2px', color: 'white' }}> keyvalue </b> </span>
        <a className="footer-link" href="https://twitch.tv/keyvalue">
          🏜️
        </a>
        <span> in Henderson, Nevada </span>
      </span>
    </div>
  )
};
