const calculateSufficientLoss = (materialArray) => {
  return materialArray.filter((item) => (
    ['Knight', 'Bishop', 'Rook'].includes(item)
  )).length <= 1; // the chess reference code uses 1 but 2 knights + king can mate
  // and there's an additional bishop
  // so let's say endgame starts early 
};

/** determines whether game is in "end" state based on remaining material
 * cant use captured pieces cuz there could have been promotions
 * so it's probably bad cuz I noticed that most other games just track piece positions
 * not the whole board
 * what was i thinking :(
**/
const isEndGame = (board) => {
  let noQueens = true; // set to false as soon as you find a queen then stop looking
  let remainingBlackMaterial = [];
  let remainingWhiteMaterial = []; 
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell === 0) return;
      const color = cell.charAt(0);
      const pieceType = cell.substring(1);
      if (color === 'w') {
        remainingWhiteMaterial.push(pieceType);
      } else {
        remainingBlackMaterial.push(pieceType);
      }

    });
  });
  const sufficientBlackLoss = calculateSufficientLoss(remainingBlackMaterial);
  const sufficientWhiteLoss = calculateSufficientLoss(remainingWhiteMaterial);

  return noQueens || sufficientBlackLoss || sufficientWhiteLoss;
}

export default isEndGame;
