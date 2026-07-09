import React from 'react';
import TURN_MIN_OPTIONS from '../../../util/turnMinOptions';
import ConfigStepper from './ConfigStepper';

function MinutesPerPlayerStepper({
  disabled = false,
  onChange,
  value,
}) {
  return (
    <ConfigStepper
      ariaLabel="Minutes per player"
      disabled={disabled}
      formatValue={(stepperValue) => String(stepperValue).padStart(2, '0')}
      onChange={onChange}
      suffix="min"
      value={value}
      values={TURN_MIN_OPTIONS}
    />
  );
}

export default MinutesPerPlayerStepper;
