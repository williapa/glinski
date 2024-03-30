import React, { forwardRef } from 'react';

const ConfigForm = forwardRef(({ clickDisabled, gameOver }, ref) => (
  <form className="configForm" ref={ref}>
    <label htmlFor="turnMin"> minutes: </label>
    <input disabled={!gameOver} 
      id="turnMin"
      name="turnMin"
      type="number"
      min={.1}
      max={10}
      defaultValue={.2}
      step={.1} 
    />
    <label htmlFor="votes"> votes: </label>
    <input disabled={clickDisabled} 
      id="votes"
      name="votes"
      type="number"
      min={1}
      max={5}
      defaultValue={1}
      step={1}
    />
  </form>
)); 

export default ConfigForm;
