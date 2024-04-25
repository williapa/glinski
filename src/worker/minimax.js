import evaluate from "./evaluate";
import minimize from "./minimize";
import maximize from "./maximize";

// returns: [number, Move]
const minimax = async (board, capturedPieces, chatFirst, depth, enPassantPawnPosition) => {
  const alpha = -Infinity;
  const beta = Infinity;
  // if board.turn === white
  if (!chatFirst) {
    return maximize(board, capturedPieces, chatFirst, depth, enPassantPawnPosition);
  } else {
    return minimize(board, capturedPieces, chatFirst, depth, enPassantPawnPosition);
  }
}

export default minimax;