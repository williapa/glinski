import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Splash from './splash/Splash';
import GameLayout from './game/GameLayout';
import dealWithSafari from './util/dealWithSafari';
import { DisableClicksProvider } from './hooks/useDisableClicks';

const setYScroll = (bool) => {
  if (bool) window.scrollTo(0,0);
  document.body.style.overflowY = bool ? 'auto': 'hidden';
}

const IdPage = () => {
  const params = useParams();
  const [playerId, setPlayerId] = useState('');

  const handleResize = () => {
    const sizes = [
      [1924, 1255],
      [1441, 875],
      [1141, 762],
      [911, 699],
      [767, 574],
      [600, 792],
      [10, 680]
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
    // just in case
    let existingId = localStorage.getItem('playerId');
    if (!existingId) {
      existingId = uuidv4();
      localStorage.setItem('playerId', existingId);
    }
    dealWithSafari();
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
        <Route path="/" element={<Splash />} />
        <Route path="/:id" element={<IdPage />} />
      </Routes>
    </Router>
  );
};

export default App;
