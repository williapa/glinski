import React from 'react';
import ConfigStepper from './ConfigStepper';

const VOTE_THRESHOLD_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function VoteThresholdStepper({
  disabled = false,
  onChange,
  value,
}) {
  return (
    <ConfigStepper
      ariaLabel="Vote threshold"
      disabled={disabled}
      onChange={onChange}
      suffix="votes"
      value={value}
      values={VOTE_THRESHOLD_OPTIONS}
    />
  );
}

export default VoteThresholdStepper;
