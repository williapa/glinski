import React, { forwardRef } from 'react';
import ColorButtonPanel from './ColorButtonPanel';
const style = { 
  border: '1px solid rgb(5,5,5,.85)',
  backgroundColor: 'rgba(5,5,5,.14)',
};

const ConfigForm = forwardRef(({ 
  clickDisabled,
  colorChoice,
  gameOver
}, ref) => (
  <form style={style} className="configForm" ref={ref}>
    <label htmlFor="turnMin"> !minutes </label>
    <input disabled={!gameOver} 
      id="turnMin"
      name="turnMin"
      type="number"
      min={1}
      max={60}
      defaultValue={10}
      step={1} 
    />
    <label htmlFor="votes"> !votes </label>
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
