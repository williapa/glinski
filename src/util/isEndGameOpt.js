// determines endGame based on captured pieces which is faster
const isEndGameOpt = (capturedPieces) => {
  const noQueens = capturedPieces.w.includes('wQueen') && capturedPieces.b.includes('bQueen');
  if (noQueens) return true;
  return calculateSufficientLoss(capturedPieces.b) || calculateSufficientLoss(capturedPieces.w);
};

const calculateSufficientLoss = (materialArray) => {
  return materialArray.filter((item) => (
    ['Knight', 'Bishop', 'Rook'].includes(item.substring(1))
  )).length <= 1; // the chess reference code uses 1 but 2 knights + king can mate
  // and there's an additional bishop
  // so let's say endgame starts early 
};


export default isEndGameOpt;
