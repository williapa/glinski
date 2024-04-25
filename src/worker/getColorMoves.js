import filterMoves from "../util/filterMoves";
import Moves from "../moves";

const convertToStartEndPositionArray = (endPositions, startPosition) => {
  const coordinateArray = [];
  // Iterate over each key in the object
  for (const x in endPositions) {
    const yValues = endPositions[x];
    // Iterate over each value in the array of Y coordinates
    yValues.forEach(y => {
      coordinateArray.push({ startPosition, endPosition: { row: Number(x), col: y } });
    });
  }
  return coordinateArray;
}
// returns all possible moves for a piece color where key is the starting coord and the value is an array of ending coords
const getColorMoves = (board, color, enPassantPawnPosition) => {
  const moves = [];
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
      const filteredMovesAsArray = convertToStartEndPositionArray(filteredMoves, { row, column });
      moves.push(...filteredMovesAsArray);
    }
  }
  return moves;
}

export default getColorMoves;
