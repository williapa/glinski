import Moves from "../moves";
import filterMoves from "./filterMoves";

const validateMove = (board, piece, startPosition, endPosition, enPassantPawnPosition, promoted) => {
  let movingPiece = promoted ? 'Pawn': piece.substring(1);
    // validate move
  const baseMoves = Moves[movingPiece](startPosition.row,startPosition.col,board,enPassantPawnPosition);
  // filter moves that would put the player in check
  const nonCheckCausingMoves = filterMoves(baseMoves, board, [piece, { row: startPosition.row, column: startPosition.col }]);
  return (nonCheckCausingMoves[endPosition.row].indexOf(endPosition.col) >= 0); // true if it's a non check causing real move
};

export default validateMove;
