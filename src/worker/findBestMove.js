import minimax from "./minimax";
// 
const findBestMove = (board, capturedPieces, chatFirst, depth, enPassantPawnPosition) => {

  const bestMove = minimax(board, capturedPieces, chatFirst, depth, enPassantPawnPosition);

  return bestMove;
  
}

export default findBestMove;
