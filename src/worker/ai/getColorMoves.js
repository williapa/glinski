import filterMoves from "../../util/filterMoves";
import Moves from "../../moves";

const convertToStartEndPositionArray = (endPositions, startPosition, colorIfPawn) => {
  const coordinateArray = [];
  // Iterate over each key in the object
  for (const x in endPositions) {
    const yValues = endPositions[x];
    yValues.forEach(y => {
      // i would have used this as "isFirstOrLast" but board is a dependency of that function 
      if (
        colorIfPawn && 
        (
          (y === 0 && colorIfPawn === 'w') || 
          (y === (10 - Math.abs(5 - Number(x))) && colorIfPawn === 'b')
        )
      ) {
        ['Queen', 'Rook', 'Bishop', 'Knight'].forEach((promotionPiece) => {
          coordinateArray.push({ 
            startPosition,
            endPosition: { 
              row: Number(x),
              col: y
            },
            promotion: `${colorIfPawn}${promotionPiece}`
          });
        });
      } else {
        // Iterate over each value in the array of Y coordinates
        coordinateArray.push({ 
          startPosition,
          endPosition: { 
            row: Number(x),
            col: y
          }
        });
      }
    });
  }
  return coordinateArray;
}
// returns all possible moves for a piece color where key is the starting coord and the value is an array of ending coords
const getColorMoves = (board, color, enPassantPawnPosition) => {
  const validMoves = [];
  for (let row = 0; row < board.length; row++) {
    const currentRow = board[row];
    for (let column = 0; column < currentRow.length; column++) {
      if (currentRow[column] === 0) continue;
      const piece = currentRow[column];
      if (piece.charAt(0) !== color) continue;
      const pieceType = piece.substr(1);
      const p = [piece, { row, column }];
      const moves = Moves[pieceType](row, column, board, enPassantPawnPosition);
      const filteredMoves = filterMoves(moves, board, p);
      const potentialPromotionFlag = (pieceType === 'Pawn') ? color : false;
      const filteredMovesAsArray = convertToStartEndPositionArray(filteredMoves, { row, column }, potentialPromotionFlag);
      validMoves.push(...filteredMovesAsArray);
    }
  }
  return validMoves;
};

export default getColorMoves;
