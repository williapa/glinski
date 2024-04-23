import React, { useState } from 'react';
import './ColorButtonPanel.css';

const options = ['random', 'stay', 'switch']

const ColorButtonPanel = ({ gameOver }) => {

  const [selected, setSelected] = useState(options[0]);

  const onClick = (e) => {
    e.preventDefault();
    setSelected(e.target.innerHTML);
  }
  
  if (!gameOver) return '';

  return (
    <div className="btn-group">
      {options.map((option) => (
        <button key={option} className={selected === option ? 'selected' : ''} onClick={onClick} >
          {option}
        </button>
      ))}
      <input id="chatFirst" name="chatFirst" type="hidden" value={selected} />
    </div>
  );
}

export default ColorButtonPanel;
