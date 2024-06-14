import React from 'react';
import './Meter.css';
const MAX = 2500;
const clampValue = (value, min, max) => Math.max(min, Math.min(max, value));

const Meter = ({ currentValue }) => {
  const clampedValue = clampValue(currentValue, -MAX, MAX);
  const percentage = (clampedValue / MAX) * 50;
  const isPositive = clampedValue >= 0;
  const blackPercentage = isPositive ? 0 : -percentage;
  const whitePercentage = isPositive ? percentage: 0;

  const whiteBarStyle = {
    height: `${whitePercentage}%`,
    transition: 'height .5s ease',
    backgroundColor: 'white',
    top: '50%'
  };

  const blackBarStyle = {
    height: `${blackPercentage}%`,
    transition: 'height .5s ease',
    backgroundColor: '#445',
    bottom: '50%'
  };

  return (
    <div className="vertical-meter-container">
      <div className="vertical-meter-bar" style={blackBarStyle}></div>
      <div className="vertical-meter-bar" style={whiteBarStyle}></div>
    </div>
  );
};

export default Meter;