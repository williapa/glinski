export default function isValidPromotion(board, row, col) {
  const piece = board[row][col];
  if (!piece) {
    return false;
  } else if (piece.charAt(0) === 'w') {
    return col === 0;
  } else {
    return (col === board[row].length - 1);
  }
}
