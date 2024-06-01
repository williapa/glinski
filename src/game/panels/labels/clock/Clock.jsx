import React from 'react';
import './Clock.css'; // Ensure this imports your CSS file

function Clock({ side, time }) {

  const formatTimeUnit = (unit) => {
    return unit < 10 ? `0${unit}` : unit.toString();
  };

  const shouldAnimate = (unit) => {
    // Animate when the last character of the unit is '0' or always for seconds
    return unit.endsWith('9');
  };

  const getPreviousDigit = (currentDigit, key) => {
    if (key.includes('tens')) {
      return currentDigit === '5' ? '0' : (parseInt(currentDigit, 10) + 1).toString();
    } else {
      return currentDigit === '9' ? '0' : (parseInt(currentDigit, 10) + 1).toString();
    }
  };

  const renderDigit = (currentDigit, isAnimated, key, blinking) => {
    // Calculate previous digit with rollover
    const prevDigit = getPreviousDigit(currentDigit, key);
  
    return (
      <div className={`digit-container ${blinking}`} key={key}>
        {isAnimated && (
          <div className="digit previous">
            {prevDigit}
          </div>
        )}
        <div className="digit current">
          {currentDigit}
        </div>
      </div>
    );
  }
  const minutes = formatTimeUnit(Math.floor(time / 60));
  const seconds = formatTimeUnit(time % 60);
  const blinking = time < 1 ? 'blinking' : '';

  return (
    <div className={`${side} clock`}>
      {renderDigit(minutes[0], shouldAnimate(minutes[1]), `minute-tens-${minutes[0]}`, blinking)}
      {renderDigit(minutes[1], shouldAnimate(seconds[0]), `minute-ones-${minutes[1]}`, blinking)}
      <span className="colon" style={{ color: 'black', fontWeight: 1000 }}>:</span>
      {renderDigit(seconds[0], shouldAnimate(seconds[1]), `second-tens-${seconds[0]}`, blinking)} 
      {renderDigit(seconds[1], true, `second-ones-${seconds[1]}`, blinking)}
      <span className="seconds">seconds</span>
      <span className="minutes">minutes</span>
    </div>
  );
}

export default Clock;