import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import GameLayout from './game/GameLayout';
import { DisableClicksProvider } from './hooks/useDisableClicks';

const setYScroll = (bool) => {
  if (bool) window.scrollTo(0,0);
  document.body.style.overflowY = bool ? 'auto': 'hidden';
}

const HomePage = () => {
  return <h1>glins.ki</h1>;
  // todo: splash page - "enter streamer"
  // video of how the game works
  // or enter email
  // something...it has to be PERFECT though
};

const IdPage = () => {
  const params = useParams();
  // TODO: temp
  const [playerId, setPlayerId] = useState('');

  const handleResize = () => {
    const sizes = [
      [1700, 1260],
      [1400, 780],
      [1100, 736],
      [868, 556],
      [640, 720]
    ];
    let sizeIndex = 0;
    const { innerHeight, innerWidth } = window;
    while (innerWidth < sizes[sizeIndex][0] && sizeIndex < (sizes.length - 1)) {
      sizeIndex++;
    }
    setYScroll(innerHeight < sizes[sizeIndex][1]);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    // TODO: this is temporary
    let existingId = localStorage.getItem('playerId');
    if (!existingId) {
      existingId = uuidv4();
      localStorage.setItem('playerId', existingId);
    }
    setPlayerId(existingId);
  }, []);

  return (
    <DisableClicksProvider>
      <GameLayout player={playerId} id={params.id}/>
    </DisableClicksProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<IdPage />} />
      </Routes>
    </Router>
  );
};

export default App;
