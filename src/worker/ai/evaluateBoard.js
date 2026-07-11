import pieceValues from "./pieceValues";
import isEndGame from "../../util/isEndGame";
import positionIncentives from "./positionIncentives";

// reduces a file - i wrote separate file + cell reducers but need row/col in same call
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

