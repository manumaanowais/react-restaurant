import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Tables from './Tables';

function App() {

  const gridItemsData = [
    { id: 101, content: 'Table 1', timer:'00:00:00', items: 'Chicken Mandi', quantity: '2', price: 500 },
    { id: 102, content: 'Table 2', timer:'00:00:00', items: 'Chicken Biryani', quantity: '1', price: 600 },
    { id: 103, content: 'Table 3', timer:'00:00:00', items: 'Chicken Curry', quantity: '2', price: 400 },
    { id: 104, content: 'Table 4', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 300 },
    { id: 105, content: 'Table 5', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 2500 },
    { id: 106, content: 'Table 6', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 4000 },
    { id: 107, content: 'Table 7', timer:'00:00:00', items: 'Mandi', quantity: '3', price: 250 },
    { id: 108, content: 'Table 8', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 100 },
    { id: 109, content: 'Table 9', timer:'00:00:00', items: 'Mandi', quantity: '1', price: 20 },
    { id: 110, content: 'Table 10', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 1000 },
    { id: 111, content: 'Table 11', timer:'00:00:00', items: 'Fish Curry', quantity: '2',  price: 160 },
    { id: 112, content: 'Table 12', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 335 },
    { id: 113, content: 'Table 13', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 270 },
    { id: 114, content: 'Table 14', timer:'00:00:00', items: 'Mandi', quantity: '1',  price: 400 },
    { id: 115, content: 'Table 15', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 560 },
    { id: 116, content: 'Table 16', timer:'00:00:00', items: 'Mandi', quantity: '3',  price: 500 },
    { id: 117, content: 'Table 17', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 540 },
    { id: 118, content: 'Table 18', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 1030 },
    { id: 119, content: 'Table 19', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 120 },
    { id: 200, content: 'Table 20', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 2300 },
    { id: 201, content: 'Table 21', timer:'00:00:00', items: 'Mandi', quantity: '8',  price: 4300 },
    { id: 202, content: 'Table 22', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 670 },
    { id: 203, content: 'Table 23', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 780 },
    { id: 204, content: 'Table 24', timer:'00:00:00', items: 'Mandi', quantity: '3',  price: 980 },
  ];



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home gridItemsData={gridItemsData} />} />
        <Route path="/:id" element={<Home gridItemsData={gridItemsData} />} />
        <Route path="/tables" element={<Tables gridItemsData={gridItemsData} />} />
      </Routes>
    </Router>
  );
}

export default App;
