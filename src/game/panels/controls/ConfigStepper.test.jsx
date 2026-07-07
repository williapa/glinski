import { fireEvent, render, screen } from '@testing-library/react';
import ConfigStepper from './ConfigStepper';

const renderStepper = (props = {}) => {
  const onChange = jest.fn();
  render(
    <ConfigStepper
      ariaLabel="Test value"
      onChange={onChange}
      value={2}
      values={[1, 2, 5]}
      {...props}
    />
  );

  return onChange;
};

test('cycles to the next value', () => {
  const onChange = renderStepper();

  fireEvent.click(screen.getByRole('button', { name: 'Increase Test value' }));

  expect(onChange).toHaveBeenCalledWith(5);
});

test('cycles to the previous value', () => {
  const onChange = renderStepper();

  fireEvent.click(screen.getByRole('button', { name: 'Decrease Test value' }));

  expect(onChange).toHaveBeenCalledWith(1);
});

test('wraps from the last option to the first option', () => {
  const onChange = renderStepper({ value: 5 });

  fireEvent.click(screen.getByRole('button', { name: 'Increase Test value' }));

  expect(onChange).toHaveBeenCalledWith(1);
});

test('wraps from the first option to the last option', () => {
  const onChange = renderStepper({ value: 1 });

  fireEvent.click(screen.getByRole('button', { name: 'Decrease Test value' }));

  expect(onChange).toHaveBeenCalledWith(5);
});

test('does not change when disabled', () => {
  const onChange = renderStepper({ disabled: true });

  fireEvent.click(screen.getByRole('button', { name: 'Increase Test value' }));

  expect(onChange).not.toHaveBeenCalled();
});

test('falls back to the first option when the current value is not found', () => {
  const onChange = renderStepper({ value: 99 });

  fireEvent.click(screen.getByRole('button', { name: 'Increase Test value' }));

  expect(onChange).toHaveBeenCalledWith(2);
});
