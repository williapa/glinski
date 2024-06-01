export default function isValidPromotion(board, row, col, startPosition) {
  const piece = board[startPosition.row][startPosition.col];
  if (!piece) {
    return false;
  } else if (piece.charAt(0) === 'w') {
    return col === 0;
  } else {
    return (col === board[row].length - 1);
  }
}
