import { createPieceDragProps } from './dragStrategies';

test('the desktop drag preview preserves the rendered piece color', () => {
  jest.useFakeTimers();

  const pieceElement = document.createElement('span');
  pieceElement.style.color = 'rgb(255, 255, 255)';
  pieceElement.getBoundingClientRect = () => ({ height: 70, width: 70 });
  document.body.appendChild(pieceElement);

  let dragPreview;
  const props = createPieceDragProps({
    canDrag: true,
    cellContent: 'wPawn',
    col: 6,
    onCancel: jest.fn(),
    onStart: jest.fn(),
    row: 1,
  });

  props.onDragStart({
    currentTarget: pieceElement,
    dataTransfer: {
      setData: jest.fn(),
      setDragImage: (element) => {
        dragPreview = element;
      },
    },
  });

  expect(dragPreview.style.color).toBe('rgb(255, 255, 255)');

  jest.runAllTimers();
  expect(dragPreview).not.toBeInTheDocument();
  pieceElement.remove();
  jest.useRealTimers();
});
