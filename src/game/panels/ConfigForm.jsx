import React, { forwardRef } from 'react';

const ConfigForm = forwardRef(({ colorChoice, streamerAiEnabled, turnMins }, ref) => (
  <form ref={ref} hidden>
    <input
      id="turnMin"
      name="turnMin"
      value={turnMins}
      readOnly
    />
    <input
      id="votes"
      name="votes"
      defaultValue={0}
    />
    <input id="aiMove" type="checkbox" checked={streamerAiEnabled} readOnly />
    <input id="chatFirst" name="chatFirst" value={colorChoice} readOnly />
  </form>
)); 

export default ConfigForm;
