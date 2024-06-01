import getVector from "./getVector";

export default function hilightRookMoves(row, column, board) {
  if (row < 0 || row >= board.length || column < 0 || column >= board[row].length || board[row][column] === 0) {
    throw new Error('Invalid row or column, or no piece at the specified location.');
  }

  const piece = board[row][column];
  const pieceType = piece.substring(1).toLowerCase();
  const pieceColor = piece.charAt(0);
  const enemyColor = pieceColor === 'w' ? 'b' : 'w';
  let moves = {};

  for (let a = 0; a < 11; a++) {
    moves[a] = [];
  }

  const addMove = (move, moves) => {
    if (moves[move.row].indexOf(move.col) < 0) {
      moves[move.row].push(move.col);
    }
    return moves;
  }

  if (pieceType === 'rook' || pieceType === 'queen') {
    const directions = ["E", "SE", "SW", "W", "NW", "NE"];

    directions.forEach((dir) => {
      let vector = getVector(row, column, dir);
      for (let i = 0; i < 10; i++) {
        if (!vector) break; // is within board check
        const newRow = vector.row;
        const newCol = vector.col;

        const targetCell = board[newRow][newCol];

        if (targetCell === 0) {
          moves = addMove({ row: newRow, col: newCol }, moves);
          vector = getVector(newRow, newCol, dir);
        } else {
          if (typeof targetCell === 'string' && targetCell.charAt(0) === enemyColor) {
            moves = addMove({ row: newRow, col: newCol }, moves);
          }
          break;
        }
      }
    });
  } else {
    throw new Error('The specified piece is not a rook.');
  }

  return moves;
}