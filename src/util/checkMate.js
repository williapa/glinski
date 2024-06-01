import Moves from "../moves";
import filterMoves from "./filterMoves";
import noMoves from "./noMoves";
import check from "./check";

// returns true if it's check mate and 'tie' if it's a tie 
export default function checkMate(realBoard, color, enPassantPawnPosition) {
  
  const board = realBoard.map((row) => row.slice());

  for (let row = 0; row < board.length; row++) {
    const currentRow = board[row];
    for (let column = 0; column < currentRow.length; column++) {
      if (currentRow[column] === 0) continue;
      const piece = currentRow[column];
      if (piece.charAt(0) !== color) continue;
      const pieceType = piece.substr(1);
      const p = [piece, { row, column }];
      const moves = Moves[pieceType](row, column, board, enPassantPawnPosition);
      const filteredMoves = filterMoves(moves, board, p);
      const noMovesLeftForThisPiece = noMoves(filteredMoves);
      if (!noMovesLeftForThisPiece) return false;
    }
  }

  // this function actually returns true when there are NO MOVES LEFT...
  // but no moves does not equate to checkmate! 
  // you need to check the state of the CURRENT board for check. 
  // if the current board is not check, then it's a tie bc there's no moves left and not check.
  if (check(realBoard, color)) return true;
  return 'tie';
};
