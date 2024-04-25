import getScoreFromPieces from "./getScoreFromPieces";

const evaluate = (board, capturedPieces, enpassantPawnPosition) => {
  // todo: incorporate positional adjustments for both sides
  return getScoreFromPieces(capturedPieces);
}