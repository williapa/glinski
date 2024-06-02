import { useState, useEffect } from 'react';
import QueenBee from '../img/queen-bee.png';

import './Splash.css';

const Splash = () => {
  const [channel, setChannel] = useState('');
  const [blurClass, setBlurClass] = useState('blur');

  useEffect(() => {
    document.body.className = "freeze";
    setTimeout(() => {
      setBlurClass('unblur');
    }, 100);
    return () => document.body.className = '';
  }, []);

  const goToChannel = (e) => {
    e.preventDefault();
    setBlurClass('blur');
    setTimeout(() => {
      window.location.href += `${channel}`;
    }, 1750);
  }

  return <div className={`splash ${blurClass}`}>
    <h1>glin.ski</h1>
    <img src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    <div className="container">
      <div className="ellipse" />
    </div>
    <form className="inputSpot" onSubmit={goToChannel}>
      <label htmlFor="channel">Type your twitch channel </label>
      <input onSubmit={goToChannel} id="channel" name="channel" type="text" value={channel} onChange={(e) => setChannel(e.target.value)} />
    </form>
    <a href="" onClick={goToChannel}>play glinski with chat!</a>
    <svg>
      <polygon points="250,50 450,150 450,350 250,450 50,350 50,150" />
    </svg>
  </div>
};

export default Splash;