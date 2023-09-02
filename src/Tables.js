import React, { useState, useEffect } from 'react';
import './Tables.css';
import Header from './Header';
import { Link } from 'react-router-dom';

function Tables({ gridItemsData }) {
  const [timers, setTimers] = useState({});

  const startTimer = (itemId) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [itemId]: 0, 
    }));
  };

  const updateTimer = (itemId) => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      [itemId]: prevTimers[itemId] + 1,
    }));
  };

  useEffect(() => {
    gridItemsData.forEach((item) => startTimer(item.id));

    const timerInterval = setInterval(() => {
      gridItemsData.forEach((item) => updateTimer(item.id));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gridItemsData]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div
          className="grid-3-columns"
          data-margin="20"
          data-item="grid-item"
          data-lightbox="gallery"
        >
          {gridItemsData.map((item) => (
            <Link to={`/${item.id}`} key={item.id} className="grid-item">
              {formatTime(timers[item.id])}<br />
              {item.content}<br />
              {item.price}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tables;
