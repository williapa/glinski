import check from "./check";

// applies a coord + piece to board, returns true if it puts piece's team in check 
export default function checkMove(coord, originalBoard, pieceData) {
  const board = originalBoard.map((row) => row.slice());
  const { row, col } = coord;
  const startingPosition = pieceData[1];
  board[row][col] = pieceData[0];
  board[startingPosition.row][startingPosition.column] = 0;
  
  return check(board, pieceData[0].charAt(0))
}
