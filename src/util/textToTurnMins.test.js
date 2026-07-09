import textToTurnMins from './textToTurnMins';

test('sets an exact minutes option from chat text', () => {
  const onChange = jest.fn();

  const result = textToTurnMins('!minutes 15', onChange);

  expect(result).toBe(15);
  expect(onChange).toHaveBeenCalledWith(15);
});

test('rounds minutes down to the nearest supported stepper option', () => {
  const onChange = jest.fn();

  const result = textToTurnMins('!minutes 24', onChange);

  expect(result).toBe(20);
  expect(onChange).toHaveBeenCalledWith(20);
});

test('ignores invalid minutes values', () => {
  const onChange = jest.fn();

  expect(textToTurnMins('!minutes 0', onChange)).toBeNull();
  expect(textToTurnMins('!minutes 100', onChange)).toBeNull();
  expect(textToTurnMins('!minutes nope', onChange)).toBeNull();
  expect(onChange).not.toHaveBeenCalled();
});
