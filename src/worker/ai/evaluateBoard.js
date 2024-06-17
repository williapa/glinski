import pieceValues from "./pieceValues";
import isEndGame from "../../util/isEndGame";
import positionIncentives from "./positionIncentives";

// reduces a file - i wrote separate file + cell reducers but need row/col in same call, so fuck it - u get 1
const fileReducer = (acc, file, row) => {
  return file.reduce((acc, cell, col) => {
    let black = 0;
    let white = 0;
    if (cell === 0) {
      return [...acc];
    }
    const piece = cell.substring(1);
    const pieceVal = pieceValues[piece];
    let pieceClass = cell;
    // acc[2] is endGame boolean
    if (piece === 'King' && !!acc[2]) {
      pieceClass = cell.charAt(0) + 'KingEndgame';
    }
    const value = pieceVal + positionIncentives[pieceClass][row][col];
    if (cell.charAt(0) === 'b') {
      black = value;
    } else {
      white = value;
    }
    return [acc[0] + black, acc[1] + white, acc[2]];
  }, acc);
};

const calculatePiece = (piece, isEndGame, position) => {
  const positionString = (piece.substring(1) === "King" && isEndGame)? piece + "Endgame" : piece;
  const col = position.col || position.column;
  return pieceValues[piece.substring(1)] + positionIncentives[positionString][position.row][col];
}

// todo: technically this does not correctly calculate a en passant capture's delta but the diff would be slight. 
// i fixed this in calculateMoveDelta and I actually dont even use this fn 
const calculateDelta = (previousValue, move, endGame) => {
  const { startPosition, endPosition, removedPiece, startingPiece, promotion, isEndGame } = move;
  const startingPieceAndPositionValue = calculatePiece(startingPiece, isEndGame, startPosition); //  pieceValues[startingPiece.substring(1)] + positionIncentives[startingPiece][startPosition.row][startPosition.column];
  const endingPiece = promotion || startingPiece;
  const endingPieceAndPositionValue = calculatePiece(endingPiece, isEndGame, endPosition); // pieceValues[endingPiece.substring(1)] + positionIncentives[`${endingPiece}${(endGame && isKing) ? 'Endgame': ''}`][]
  const captureValue = !!removedPiece ? calculatePiece(removedPiece, isEndGame, endPosition) : 0; //  pieceValues[removedPiece.substring(1)] + positionIncentives[removedPiece];
  let delta = endingPieceAndPositionValue - startingPieceAndPositionValue + captureValue;
  if (startingPiece.charAt(0) === 'b') {
    delta = -delta;
  }
  return previousValue + delta;
};

// + favors white, - favors black
const evaluateBoard = (board, optimizeEval) => {
  const endGame = isEndGame(board);
  // this is a lot of work thats why all the stuff is up there
  const [blackScore, whiteScore] = board.reduce(fileReducer, [0, 0, endGame]);
  // const whiteScore = b.reduce(scoreReducer, 0); // adds up captured black piece values
  // const blackScore = w.reduce(scoreReducer, 0); // vice versa
  return whiteScore - blackScore;
}

export default evaluateBoard;


