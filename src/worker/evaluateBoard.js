import pieceValues from "./pieceValues";
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
    const value = pieceVal + positionIncentives[cell][row][col];
    if (cell.charAt(0) === 'b') {
      black = value;
    } else {
      white = value;
    }
    return [acc[0] + black, acc[1] + white];
  }, acc);
};

// + favors white, - favors black
const evaluateBoard = (board) => {
  // file as in chessboard files
  const [blackScore, whiteScore] = board.reduce(fileReducer, [0, 0]);
  // const whiteScore = b.reduce(scoreReducer, 0); // adds up captured black piece values
  // const blackScore = w.reduce(scoreReducer, 0); // vice versa
  return whiteScore - blackScore;
}

export default evaluateBoard;
