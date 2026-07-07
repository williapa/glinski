import React from 'react';
import ConfigStepper from './ConfigStepper';

const TURN_MIN_OPTIONS = [1, 2, 5, 10, 15, 20, 30, 45, 60, 90];

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
