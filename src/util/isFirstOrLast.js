export default function isFirstOrLast(board, row, col) {
  return col === 0 || col === board[row].length - 1;
}