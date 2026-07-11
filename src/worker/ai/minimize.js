import applyMove from "./applyMove";
import checkMate from "../../util/checkMate";
import isEndgameOpt from "../../util/isEndGameOpt";
import getColorMoves from "./getColorMoves";
import maximize from "./maximize";

const minimize = (alpha, beta, board, capturedPieces, chatFirst, depth, enPassantPawnPosition, odd, isChatsMove, initialScore) => {
  let move = null;

  if (depth === 0) {
    return [initialScore, move];
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

  const isEndGameYet = isEndgameOpt(capturedPieces);

  const moves = getColorMoves(board, currentTurn, enPassantPawnPosition);

  for (const coords of moves) {
    // apply move and get the updated board, capturedPieces, enPassant. aka "FEN" whatever that is MAN
    const { newBoard, newCapturedPieces, newEnPassantPosition, scoreDelta } = applyMove(board, capturedPieces, coords, enPassantPawnPosition, isEndGameYet);
    const [evaluation] = maximize(alpha, beta, newBoard, newCapturedPieces, chatFirst, depth - 1, newEnPassantPosition, odd, isChatsMove, (initialScore + scoreDelta));

    if(!move) {
      move = coords;
    }

    if (evaluation <= alpha) {
      return [alpha, coords];
    }

    if (evaluation < beta) {
      move = coords;
      beta = evaluation;
    }
  }

  return [beta, move];
};

export default minimize;
