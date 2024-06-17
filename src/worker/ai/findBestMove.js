import minimax from "./minimax";
// 
const findBestMove = (board, capturedPieces, chatFirst, depth, enPassantPawnPosition, isChatsMove, initialScore) => {

  const bestMove = minimax(board, capturedPieces, chatFirst, depth, enPassantPawnPosition, isChatsMove, initialScore);

  return bestMove;
  
}

export default findBestMove;
