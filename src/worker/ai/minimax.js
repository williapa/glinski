import minimize from "./minimize";
import maximize from "./maximize";

// returns: [number, Move]
const minimax = (board, capturedPieces, chatFirst, depth, enPassantPawnPosition, isChatsMove, initialScore) => {
  const alpha = -Infinity;
  const beta = Infinity;
  // did the initial depth start as an odd number? in order to determine turn in the depth 
  const odd = depth % 2;
  // if board.turn === white
  if (chatFirst === isChatsMove) {
    return maximize(alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd, isChatsMove, initialScore);
  } else {
    return minimize(alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd, isChatsMove, initialScore);
  }
  // todo: add hashTable as arg, check if move creates repeated state here
  // if it does, run with depth of 1 and with a flag to check repeat states in min/max
}

export default minimax;
