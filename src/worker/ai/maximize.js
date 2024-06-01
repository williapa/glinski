import applyMove from "./applyMove";
import checkMate from "../../util/checkMate";
import evaluateBoard from "./evaluateBoard"; 
import getColorMoves from "./getColorMoves";
import minimize from "./minimize";


// todo: i dont think this accounts for promotions correctly 
const maximize = (alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd, isChatsMove) => {
  let move = null;
  // check for game over / tied 
  if (depth === 0) {
    return [evaluateBoard(board), move];
  }
  // THIS IS ASSUMING THE DEPTH IS EVEN. NEEDS TO FLIP IF DEPTH IS INITIALLY ODD. THIS ISNT GOOD
  const currentTurn = (chatFirst === ((depth + !!isChatsMove) % 2 === odd)) ? 'b' : 'w';
  
  const gameIsFinished = checkMate(board, currentTurn, enPassantPawnPosition);

  if (gameIsFinished === 'tie') {
    return [0, move];
  }

  if (gameIsFinished) {
    const evaluation = currentTurn === 'b' ? Infinity: -Infinity;
    return [evaluation, move];
  }

  const moves = getColorMoves(board, currentTurn, enPassantPawnPosition);

  for (const coords of moves) {
    // apply move and get the updated board, capturedPieces, enPassant. aka "FEN" whatever that is MAN
    const { newBoard, newCapturedPieces, newEnPassantPosition, removedPiece, startingPiece } = applyMove(board, capturedPieces, coords, enPassantPawnPosition);
    const [evaluation] = minimize(alpha, beta, newBoard, newCapturedPieces, chatFirst, depth - 1, newEnPassantPosition, odd, isChatsMove);

    if(!move) {
      move = coords;
    }

    if (evaluation >= beta) {
      return [beta, coords];
    }

    if (evaluation > alpha) {
      move = coords;
      alpha = evaluation;
    }
  }

  return [alpha, move];
};

export default maximize;
