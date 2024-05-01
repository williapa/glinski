import React, { forwardRef } from 'react';
import ColorButtonPanel from './ColorButtonPanel';

const ConfigForm = forwardRef(({ 
  clickDisabled,
  colorChoice,
  gameOver
}, ref) => (
  <form style={{ /* display: 'none' */ }} className="configForm" ref={ref}>
    <label htmlFor="turnMin"> minutes: </label>
    <input disabled={!gameOver} 
      id="turnMin"
      name="turnMin"
      type="number"
      min={1}
      max={15}
      defaultValue={15}
      step={1} 
    />
    <label htmlFor="votes"> votes: </label>
    <input disabled={clickDisabled && !gameOver}
      id="votes"
      name="votes"
      type="number"
      min={1}
      max={5}
      defaultValue={1}
      step={1}
    />
    <ColorButtonPanel initial={colorChoice} gameOver={gameOver} />
  </form>
)); 

export default ConfigForm;
