import getVector from "./getVector";

const directions = ['E', 'SE', 'SW', 'W', 'NW', 'NE'];
const secondVectors = {
  'E': ['NE', 'SE'],
  'SE': ['E', 'SW'],
  'W': ['NW', 'SW'],
  'SW': ['W', 'SE'],
  'NE': ['NW', 'E'],
  'NW': ['W', 'NE']
}

export default function getKnightMoves(row, column, board) {
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

  if (piece.substring(1).toLowerCase() === 'knight') {
    directions.forEach((dir) => {
      let vector = getVector(row, column, dir);
      if (!vector) return;
      vector = getVector(vector.row, vector.col, dir);
      if (!vector) return;
      const potentialDestinations = secondVectors[dir];
      potentialDestinations.forEach((secondDir) => {
        const dest = getVector(vector.row, vector.col, secondDir);
        if (dest && (board[dest.row][dest.col] === 0 || board[dest.row][dest.col].charAt(0) === enemyColor)) {
          moves = addMove(dest, moves);
        }
      })
    });
  } else {
    throw new Error('piece being moved is not a knight');
  }

  return moves;
}