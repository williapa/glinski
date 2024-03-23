import React, { forwardRef } from 'react';

const ConfigForm = forwardRef((props, ref) => (
  <></>
)); /*
  <form ref={ref}>
    <label htmlFor="chatTurnLength">chat turn length: </label>
    <input name="chatTurnLength" type="number" min={30} max={60} defaultValue={45} />
    <label htmlFor="chatVotes">  required votes: </label>
    <input name="chatVotes" type="number" min={1} max={3} defaultValue={1} />
  </form>
)); */

export default ConfigForm;
