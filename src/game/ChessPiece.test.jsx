import { render } from '@testing-library/react';
import ChessPiece from './ChessPiece';

const pieceTypes = ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

test.each(pieceTypes)('renders %s on the same normalized canvas', (pieceType) => {
  const { container } = render(<ChessPiece piece={`w${pieceType}`} />);
  const svg = container.querySelector('svg');

  expect(svg).toBeInTheDocument();
  expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('renders nothing for an unknown piece', () => {
  const { container } = render(<ChessPiece piece="wDragon" />);

  expect(container).toBeEmptyDOMElement();
});
