import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Tables from './Tables';

function App() {

  const gridItemsData = [
    { id: 1, content: 'Table 1', timer:'00:00:00', items: 'Chicken Mandi', quantity: '2', price: 500 },
    { id: 2, content: 'Table 2', timer:'00:00:00', items: 'Chicken Biryani', quantity: '1', price: 600 },
    { id: 3, content: 'Table 3', timer:'00:00:00', items: 'Chicken Curry', quantity: '2', price: 400 },
    { id: 4, content: 'Table 4', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 300 },
    { id: 5, content: 'Table 5', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 2500 },
    { id: 6, content: 'Table 6', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 4000 },
    { id: 7, content: 'Table 7', timer:'00:00:00', items: 'Mandi', quantity: '3', price: 250 },
    { id: 8, content: 'Table 8', timer:'00:00:00', items: 'Mandi', quantity: '2', price: 100 },
    { id: 9, content: 'Table 9', timer:'00:00:00', items: 'Mandi', quantity: '1', price: 20 },
    { id: 10, content: 'Table 10', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 1000 },
    { id: 11, content: 'Table 11', timer:'00:00:00', items: 'Fish Curry', quantity: '2',  price: 160 },
    { id: 12, content: 'Table 12', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 335 },
    { id: 13, content: 'Table 13', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 270 },
    { id: 14, content: 'Table 14', timer:'00:00:00', items: 'Mandi', quantity: '1',  price: 400 },
    { id: 15, content: 'Table 15', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 560 },
    { id: 16, content: 'Table 16', timer:'00:00:00', items: 'Mandi', quantity: '3',  price: 500 },
    { id: 17, content: 'Table 17', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 540 },
    { id: 18, content: 'Table 18', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 1030 },
    { id: 19, content: 'Table 19', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 120 },
    { id: 20, content: 'Table 20', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 2300 },
    { id: 21, content: 'Table 21', timer:'00:00:00', items: 'Mandi', quantity: '8',  price: 4300 },
    { id: 22, content: 'Table 22', timer:'00:00:00', items: 'Mandi', quantity: '4',  price: 670 },
    { id: 23, content: 'Table 23', timer:'00:00:00', items: 'Mandi', quantity: '2',  price: 780 },
    { id: 24, content: 'Table 24', timer:'00:00:00', items: 'Mandi', quantity: '3',  price: 980 },
  ];



  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home gridItemsData={gridItemsData} />} />
        <Route path="/home/:id" element={<Home gridItemsData={gridItemsData} />} />
        <Route path="/tables" element={<Tables gridItemsData={gridItemsData} />} />
      </Routes>
    </Router>
  );
}

export default App;
