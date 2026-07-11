import React, { useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SplashV2 from './splash/SplashV2';
import GameLayout from './game/GameLayout';
import dealWithSafari from './util/dealWithSafari';
import { DisableClicksProvider } from './hooks/useDisableClicks';

const IdPage = () => {
  const params = useParams();
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
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
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashV2 />} />
          <Route path="/:id" element={<IdPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
