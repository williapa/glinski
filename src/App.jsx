import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Splash from './splash/Splash';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Splash />} />
      </Routes>
    </Router>
  );
};

export default App;
