import hilightRookMoves from "./getRookMoves";
import hilightBishopMoves from "./getBishopMoves";

export default function getQueenMoves(row, column, board) {
  const rookMoves = hilightRookMoves(row,column,board);
  const bishopMoves = hilightBishopMoves(row,column,board);
  const moves = {};
  for(let a = 0; a < 11; a++) {
    moves[a] = [...new Set([...rookMoves[a], ...bishopMoves[a]])];
  }
  return moves;
}
