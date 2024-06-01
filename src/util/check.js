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
      if (!piece || piece.charAt(0) === color) continue;
      if (piece.charAt(0) !== color) {
        const pieceType = piece.substr(1);
        let moves = Movements[pieceType](r,c,board);
        const moveKeys = Object.keys(moves);
        for (let i = 0; i < moveKeys.length; i++) {
          for (let j = 0; j < moves[i].length; j++) {
            let o = moveKeys[i];
            let k = moves[o][j];
            if (board[o][k] && board[o][k] === `${color}King`) return true;
          }
        }
      }
    }
  }
  return false;
};
