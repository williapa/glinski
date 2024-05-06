
import { useEffect } from 'react';
import QueenBee from '../img/queen-bee.png';

import './Splash.css';

const Splash = () => {
  useEffect(() => {
    document.body.className = "freeze";
    return () => document.body.className = '';
  }, []);
  return <div className="splash">
    <h1>glin.ski</h1>
    <img src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    <div className="container">
      <div className="ellipse" />
    </div>
    <a href="https://twitch.tv/keyvalue">Play now on twitch!</a>
    <svg>
      <polygon points="250,50 450,150 450,350 250,450 50,350 50,150" />
    </svg>
  </div>
};

export default Splash;