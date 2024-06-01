import React, { forwardRef } from 'react';
import ColorButtonPanel from './ColorButtonPanel';
import './ConfigForm.css';

const style = { 
  border: '1px solid rgb(5,5,5,.85)',
  backgroundColor: '#efefef',
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
      min={2}
      max={60}
      defaultValue={2}
      step={1} 
    />
    <label htmlFor="votes"> !votes </label>
    <input disabled={!clickDisabled && !gameOver}
      id="votes"
      name="votes"
      type="number"
      min={0}
      max={5}
      defaultValue={0}
      step={1}
    />
    <label id="switch">
      <input id="aiMove" type="checkbox" />
      <span className="slider" />
    </label>
    <ColorButtonPanel initial={colorChoice} gameOver={gameOver} />
  </form>
)); 

export default ConfigForm;
