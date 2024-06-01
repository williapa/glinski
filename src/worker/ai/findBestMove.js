import minimax from "./minimax";
// 
const findBestMove = (board, capturedPieces, chatFirst, depth, enPassantPawnPosition, isChatsMove) => {

  const bestMove = minimax(board, capturedPieces, chatFirst, depth, enPassantPawnPosition, isChatsMove);

  return bestMove;
  
}

export default findBestMove;
