const scoreReducer = (pv, cv) => {
  const v = cv.toLowerCase();
  if (v.indexOf('queen') > -1) {
    return pv + 9;
  } else if (v.indexOf('rook') > -1) {
    return pv + 5;
  } else if (v.indexOf('bishop') > -1) {
    return pv + 3;
  } else if (v.indexOf('knight') > -1) {
    return pv + 3;
  } else {
    // must be a pawn
    return pv + 1;
  }
};
// + favors white, - favors black
const getScoreFromPieces = ({ b, w }) => {
  const whiteScore = b.reduce(scoreReducer, 0); // adds up captured black piece values
  const blackScore = w.reduce(scoreReducer, 0); // vice versa
  // todo: incorporate position incentives
  return whiteScore - blackScore;
}

export default getScoreFromPieces;
