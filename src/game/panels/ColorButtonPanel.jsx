import React, { useState, useEffect } from 'react';
import './ColorButtonPanel.css';

const options = ['black', 'white']

const ColorButtonPanel = ({ gameOver, initial }) => {

  const [selected, setSelected] = useState(initial);

  useEffect(() => {
    setSelected(initial);
  }, [initial]);

  const onClick = (e) => {
    e.preventDefault();
    setSelected(e.target.innerHTML.substring(1));
  }
  
  // if (!gameOver) return '';

  return (
    <div className="btn-group">
      <button disabled key={1}>
        chat plays:
      </button>
      {options.map((option) => (
        <button key={option} className={selected === option ? 'option selected' : 'option'} onClick={onClick} >
          !{option}
        </button>
      ))}
      <input id="chatFirst" name="chatFirst" type="hidden" value={selected} />
    </div>
  );
}

export default ColorButtonPanel;
