import minimize from "./minimize";
import maximize from "./maximize";

// returns: [number, Move]
const minimax = (board, capturedPieces, chatFirst, depth, enPassantPawnPosition) => {
  const alpha = -Infinity;
  const beta = Infinity;
  const odd = depth % 2;
  // if board.turn === white
  if (!chatFirst) {
    return maximize(alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd);
  } else {
    return minimize(alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd);
  }
}

export default minimax;