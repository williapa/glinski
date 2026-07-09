import TURN_MIN_OPTIONS from './turnMinOptions';

const MIN_TURN_MINS = 1;
const MAX_TURN_MINS_COMMAND_VALUE = 99;

const textToTurnMins = (text, onChange) => {
  const requestedMins = parseInt((text.split(' ')[1] || '').trim(), 10);

  if (
    isNaN(requestedMins)
    || requestedMins < MIN_TURN_MINS
    || requestedMins > MAX_TURN_MINS_COMMAND_VALUE
  ) {
    return null;
  }

  const turnMins = [...TURN_MIN_OPTIONS]
    .reverse()
    .find((option) => option <= requestedMins);

  if (turnMins && onChange) {
    onChange(turnMins);
  }

  return turnMins || null;
};

export default textToTurnMins;
