import React, { forwardRef } from 'react';

const ConfigForm = forwardRef(({ colorChoice }, ref) => (
  <form ref={ref} hidden>
    <input
      id="turnMin"
      name="turnMin"
      defaultValue={2}
    />
    <input
      id="votes"
      name="votes"
      defaultValue={0}
    />
    <input id="aiMove" type="checkbox" />
    <input id="chatFirst" name="chatFirst" value={colorChoice} readOnly />
  </form>
)); 

export default ConfigForm;
