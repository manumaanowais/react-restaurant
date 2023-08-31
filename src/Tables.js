import React from 'react';
import './Tables.css';
import Header from './Header';
import { Link } from 'react-router-dom';

function Tables({ gridItemsData }) {

  const handleDivClick = (item) => {
    // item.timer = timer;
  };
  




  return (
    <div>
      <Header />
      <div className="container">
        <div className="grid-3-columns" data-margin="20" data-item="grid-item" data-lightbox="gallery">
          {gridItemsData.map((item) => (
            <Link to={`/home/${item.id}`} key={item.id} className="grid-item"  onClick={() => handleDivClick(item)}>
            {item.content}<br />{item.price}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tables;
