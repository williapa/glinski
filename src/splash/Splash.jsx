import { useState, useEffect } from 'react';
import SoloGameLayout from '../game/SoloGameLayout';
import { DisableClicksProvider } from '../hooks/useDisableClicks';
import QueenBee from '../img/queen-bee.png';
import './Splash.css';

const Splash = () => {
  const [playSolo, setPlaySolo] = useState(false);
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
    if (channel.length < 4) return;
    setBlurClass('blur');
    setTimeout(() => {
      const href = window.location.href;
      window.location.href += `${href.endsWith('/') ? '' : '/'}#/${channel}`;
    }, 1750);
  }

  if (playSolo) {
    return (
      <DisableClicksProvider>
        <SoloGameLayout />
      </DisableClicksProvider>
    );
  }

  return <div className={`splash ${blurClass}`}>
    <h1>glin ski</h1>
    <img src={QueenBee} alt="Honeycomb chess mascot, Beatrice" />
    <div className="container">
      <div className="ellipse" />
    </div>
    <form className="inputSpot" onSubmit={goToChannel}>
      <div className="mabel">
        <label htmlFor="channel">type your twitch channel </label>
      </div>
      <div className="input">
        <input onSubmit={goToChannel} id="channel" name="channel" type="text" value={channel} onChange={(e) => setChannel(e.target.value)} />
      </div>
      
    </form>
    
    <button className="soloButton" onClick={() => setPlaySolo(true)}>No twitch? Play solo!</button>
    
    <a href={`#/${channel || ''}`} onClick={goToChannel}>play glinski with chat!</a>
    <svg>
      <polygon points="250,50 450,150 450,350 250,450 50,350 50,150" />
    </svg>
  </div>
};

export default Splash;
