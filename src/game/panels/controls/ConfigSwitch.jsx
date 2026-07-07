import React from 'react';

function ConfigSwitch({
  ariaLabel,
  checked,
  className = '',
  disabled = false,
  leftLabel,
  onChange,
  rightLabel,
}) {
  return (
    <label className={`moveLog-config-switch ${className} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        aria-label={ariaLabel}
      />
      <span className="moveLog-config-switch-track">
        <span className="moveLog-config-switch-option">{leftLabel}</span>
        <span className="moveLog-config-switch-option">{rightLabel}</span>
        <span className="moveLog-config-switch-thumb" />
      </span>
    </label>
  );
}

export default ConfigSwitch;
