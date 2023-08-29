import React from 'react';
import './Tables.css';
import Header from './Header';

function Tables() {
  const handleDivClick = (item) => {
    alert("Table: " + item.id + "has ordered items worth of RS. "+ item.price);
  };

  const gridItemsData = [
    { id: 1, content: 'Table 1', price: 500 },
    { id: 2, content: 'Table 2', price: 500 },
    { id: 3, content: 'Table 3', price: 500 },
    { id: 4, content: 'Table 4', price: 500 },
    { id: 5, content: 'Table 5', price: 500 },
    { id: 6, content: 'Table 6', price: 500 },
    { id: 7, content: 'Table 7', price: 500 },
    { id: 8, content: 'Table 8', price: 500 },
    { id: 9, content: 'Table 9', price: 500 },
    { id: 10, content: 'Table 10', price: 500 },
    { id: 11, content: 'Table 11', price: 500 },
    { id: 12, content: 'Table 12', price: 500 },
    { id: 13, content: 'Table 13', price: 500 },
    { id: 14, content: 'Table 14', price: 500 },
    { id: 15, content: 'Table 15', price: 500 },
    { id: 16, content: 'Table 16', price: 500 },
    { id: 17, content: 'Table 17', price: 500 },
    { id: 18, content: 'Table 18', price: 500 },
    { id: 19, content: 'Table 19', price: 500 },
    { id: 20, content: 'Table 20', price: 500 },
    { id: 21, content: 'Table 21', price: 500 },
    { id: 22, content: 'Table 22', price: 500 },
    { id: 23, content: 'Table 23', price: 500 },
    { id: 24, content: 'Table 24', price: 500 },
  ];

  const generateGridItems = () => {
    return gridItemsData.map((item) => (
      <div className="grid-item" id={item.id.toString()} onClick={() => handleDivClick(item)}>
        {item.content}<br></br> {item.price}
      </div>
    ));
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="grid-3-columns" data-margin="20" data-item="grid-item" data-lightbox="gallery">
          {generateGridItems()}
        </div>
      </div>
    </div>
  );
}

export default Tables;
