import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Tables from './Tables';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/table/:tableId" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
