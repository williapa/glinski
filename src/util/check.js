import Movements from '../moves';

// returns true if this board state would put color in check
export default function check(realBoard, color) {
  // check every square of the board
  const board = realBoard.map(function(row) {
    return row.slice();
  });
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (typeof piece !== 'string' || piece.charAt(0) === color) continue;

      const pieceType = piece.substr(1);
      const movement = Movements[pieceType];
      if (typeof movement !== 'function') continue;

      const moves = movement(r, c, board);
      const moveKeys = Object.keys(moves);
      for (let i = 0; i < moveKeys.length; i++) {
        const row = moveKeys[i];
        for (let j = 0; j < moves[row].length; j++) {
          const column = moves[row][j];
          if (board[row][column] === `${color}King`) return true;
        }
      }
    }
  }
  return false;
}
