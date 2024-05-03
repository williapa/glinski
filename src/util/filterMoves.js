import checkMove from "./checkMove";

export default function filterMoves(moves, realBoard, pieceData) {
  const nonCheckCausingMoves = {};
  const board = realBoard.map((row) => row.slice());
  const moveKeys = Object.keys(moves);
  moveKeys.forEach((row) => {
    nonCheckCausingMoves[row] = [];
    const columns = moves[row];
    columns.forEach((col) => {
      if (!checkMove({ row, col }, board, pieceData)) {
        nonCheckCausingMoves[row].push(col);
      }
    });
  });

  return nonCheckCausingMoves;
};
