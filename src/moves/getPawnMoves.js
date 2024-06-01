const startingPawnPositions = {
  'b': {
    0: [],
    1: [0],
    2: [1],
    3: [2],
    4: [3],
    5: [4],
    6: [3],
    7: [2],
    8: [1],
    9: [0],
    10: []
  },
  'w': {
    0: [],
    1: [6],
    2: [6],
    3: [6],
    4: [6],
    5: [6],
    6: [6],
    7: [6],
    8: [6],
    9: [6],
    10: []
  }
}

export default function getPawnMoves(row, column, board, enPassantPawnPosition) {
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
  
  const isWithinBoard = (row, col) => row >= 0 && row < board.length && col >= 0 && col < board[row].length;

  const addMove = (move, moves) => {
    if (moves[move.row].indexOf(move.col) < 0) {
      moves[move.row].push(move.col);
    }
    return moves;
  }

  if (piece.substring(1).toLowerCase() === 'pawn') {
    const direction = pieceColor === 'b' ? 1 : -1;
    const leftCutoff = pieceColor === 'w' ? 1 : 0;
    const rightCutoff = pieceColor === 'w' ? 1 : 0;
    const leftOffset = row <= 5 - leftCutoff ? 0 : 1;
    const rightOffset = row < 5 + rightCutoff ? 1 : 0;
    const nonCapturingAlphaMove = { row: row, col: column + (direction * 2) }
    const nonCapturingMove = { row: row, col: column + direction };
    const leftCapturingMove = { row: row - (1 * direction), col: column + (leftOffset * direction) };
    const leftCapPassant = { row: leftCapturingMove.row, col: leftCapturingMove.col - direction };
    const rightCapturingMove = { row: row + (1 * direction), col: column + (rightOffset * direction) };
    const rightCapPassant = { row: rightCapturingMove.row, col: rightCapturingMove.col - direction };

    
    // Check non-capturing move 
    if (isWithinBoard(nonCapturingMove.row, nonCapturingMove.col) && board[nonCapturingMove.row][nonCapturingMove.col] === 0) {
      moves = addMove(nonCapturingMove, moves);
      // Check non-capturing alpha move - 2 ahead (requires particular starting position)
      // Unalike the other moves, we know this move is "within the board" because it is the case for all starting pawns;
      // EXCEPT the center row, which may be impeded by the other pawn.
      // It's always necessary to check the vacant space. 
      // Also, the space in front has to be empty. so this is nested.
      if (startingPawnPositions[pieceColor][row].indexOf(column) > -1 && board[nonCapturingAlphaMove.row][nonCapturingAlphaMove.col] === 0) {
        moves = addMove(nonCapturingAlphaMove, moves);
      }
    }
    
    // Check left capturing move
    if (isWithinBoard(leftCapturingMove.row, leftCapturingMove.col) && board[leftCapturingMove.row][leftCapturingMove.col] && board[leftCapturingMove.row][leftCapturingMove.col].charAt(0) === enemyColor) {
      moves = addMove(leftCapturingMove, moves);
    }
    
    // Check right capturing move
    if (isWithinBoard(rightCapturingMove.row, rightCapturingMove.col) && board[rightCapturingMove.row][rightCapturingMove.col] && board[rightCapturingMove.row][rightCapturingMove.col].charAt(0) === enemyColor) {
      moves = addMove(rightCapturingMove, moves);
    }

    // check left capture - passant
    if (enPassantPawnPosition && enPassantPawnPosition.row === leftCapPassant.row && enPassantPawnPosition.col === leftCapPassant.col) {
      moves = addMove(leftCapturingMove, moves);
    }
    // check right capture - passant 
    if (enPassantPawnPosition && enPassantPawnPosition.row === rightCapPassant.row && enPassantPawnPosition.col === rightCapPassant.col) {
      moves = addMove(rightCapturingMove, moves);
    }

  } else {
    throw new Error('The specified piece is not a pawn.');
  }
  
  return moves;
}
