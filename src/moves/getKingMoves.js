// king can move to every neighbor
// and every diagonal 
// but only one iteration
import getVector from "./getVector";

// TODO: can't let king move into a spot where he gets captured
export default function getKingMoves(row, column, board) {
  if (row < 0 || row >= board.length || column < 0 || column >= board[row].length || board[row][column] === 0) {
    throw new Error('Invalid row or column, or no piece at the specified location.');
  }

  const piece = board[row][column];
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

  if (piece.substring(1).toLowerCase() === 'king') {
    const directions = ["E", "SE", "SW", "W", "NW", "NE"];

    directions.forEach((dir, ind) => {
      let vector = getVector(row, column, dir);

      if (!vector) return; // is within board check
      const newRow = vector.row;
      const newCol = vector.col;

      const targetCell = board[newRow][newCol];

      if (targetCell === 0) {
        moves = addMove({ row: newRow, col: newCol }, moves);
      } else {
        if (typeof targetCell === 'string' && targetCell.charAt(0) === enemyColor) {
          moves = addMove({ row: newRow, col: newCol }, moves);
        }
      }
  
      const secondDir = directions[(ind+1)%directions.length];
      vector = getVector(newRow, newCol, secondDir);
      if (!vector) return; // is within board check
      const diagonalRow = vector.row;
      const diagonalCol = vector.col;

      const diagonalTargetCell = board[diagonalRow][diagonalCol];

      if (diagonalTargetCell === 0) {
        moves = addMove({ row: diagonalRow, col: diagonalCol }, moves);
      } else {
        if (typeof diagonalTargetCell === 'string' && diagonalTargetCell.charAt(0) === enemyColor) {
          moves = addMove({ row: diagonalRow, col: diagonalCol }, moves);
        }
      }
      
    });
  } else {
    throw new Error('The specified piece is not a rook.');
  }

  return moves;
}