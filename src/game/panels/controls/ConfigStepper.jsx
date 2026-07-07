import React from 'react';
import './ConfigStepper.css';

function ConfigStepper({
  ariaLabel,
  className = '',
  disabled = false,
  formatValue = (stepperValue) => stepperValue,
  incrementLabel = '+',
  decrementLabel = '-',
  onChange,
  suffix,
  value,
  values = [],
}) {
  const selectedIndex = values.findIndex((option) => option === value || String(option) === String(value));
  const safeIndex = selectedIndex > -1 ? selectedIndex : 0;
  const buttonsDisabled = disabled || values.length === 0;

  const cycleValue = (direction) => {
    if (buttonsDisabled) return;

    const nextIndex = (safeIndex + direction + values.length) % values.length;
    if (onChange) {
      onChange(values[nextIndex]);
    }
  };

  const rootClassName = ['config-stepper', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} aria-label={ariaLabel} role="group">
      <button
        aria-label={`Decrease ${ariaLabel}`}
        className="config-stepper__button"
        disabled={buttonsDisabled}
        type="button"
        onClick={() => cycleValue(-1)}
      >
        {decrementLabel}
      </button>
      <span className="config-stepper__value">
        {formatValue(value)}
        {suffix ? <small className="config-stepper__suffix">{suffix}</small> : null}
      </span>
      <button
        aria-label={`Increase ${ariaLabel}`}
        className="config-stepper__button"
        disabled={buttonsDisabled}
        type="button"
        onClick={() => cycleValue(1)}
      >
        {incrementLabel}
      </button>
    </div>
  );
}

export default ConfigStepper;
