import React, { useEffect, useState } from 'react';
import pieceMap from '../../util/pieceMap';
import './Popup.css';

function Popup({ isVisible, color, onCancel, onConfirm }) {
  const [selectedOption, setSelectedOption] = useState(`${color}Queen`);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!color) {
      onConfirm();
    } else {
      const { row, col } = isVisible.dest;
      onConfirm(selectedOption, row, col);
    }
  };

  const filter = ([key]) => (key.charAt(0) === color && key.indexOf('Pawn') < 0 && key.indexOf('King') < 0);

  const options = Object.entries(pieceMap).filter(filter).map(([key]) => key);

  useEffect(() => {
    // Ensures the selectedOption state is updated if the options array changes
    if (!options.includes(selectedOption)) {
        setSelectedOption(`${color}Queen`); 
    }
  }, [options, selectedOption, color]);

  const ColorOptions = (
    <div className="options" style={{ display: 'flex' }}>
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          className={`option-button ${selectedOption === option ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option)}
          onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'}
          onMouseOut={(e) => e.target.style.backgroundColor = ''}
        >
          {pieceMap[option]}
        </button>
      ))}
    </div>
  );

  return (
    isVisible && (
      <div className="popup position">
        <form className="form">
          { color ? ColorOptions : (
            <p> 
              Please confirm to hear sounds.
            </p>
          )}
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </form>
      </div>
    )
  );
}

export default Popup;