import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import DataTable from './DataTable'; // Assuming DataTable is in the same directory
import GameBoard from './game/GameBoard';
import { DisableClicksProvider } from './hooks/useDisableClicks';

const HomePage = () => {
  // You can pass the appropriate attributes to the DataTable here

  return <DataTable port="3000" path="" />;
  // todo: splash page + oauth flow (+ lambda?)
};

const IdPage = () => {
  const params = useParams();
  return (
    <DisableClicksProvider>
      <GameBoard id={params.id}/>
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