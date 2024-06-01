import blackKingCheck from './blackKingCheck';
import checkMove from './checkMove'; // adjust the import to your file structure
import emptyBoard from './emptyBoard';

describe('checkMove', () => {
  let board = emptyBoard();
  // add a black king
  board[0][1] = "bKing";
  // add a white king
  board[0][3] = "wKing";
  // now we have a game!!!
  it('case 1: king should NOT be able to move next to another king', () => {
    const invalidBlackKingMoveResult = checkMove({ row: 0, col: 2 }, board, ["bKing", { row: 0, column: 1 }]);
    expect(invalidBlackKingMoveResult).toBeTruthy();

    const invalidWhiteKingMoveResult = checkMove({ row: 0, col: 2 }, board, ["wKing", { row: 0, column: 3 }]);
    expect(invalidWhiteKingMoveResult).toBeTruthy();
  });

  it('case 2: king SHOULD be able to move away from the other king', () => {
    const validBlackKingMoveResult = checkMove({ row: 0, col: 0 }, board, ["bKing", { row: 0, column: 1 }]);
    expect(validBlackKingMoveResult).toBeFalsy();

    const validWhiteKingMoveResult = checkMove({ row: 0, col: 4 }, board, ["wKing", { row: 0, column: 3 }]);
    expect(validWhiteKingMoveResult).toBeFalsy();
  });

  it('case 3: black king in check from rook & queen, multiple black pieces still have safe moves', () => {
    const blackKingCheckBoard = blackKingCheck();
    // this move is not safe because the queen could take
    const validBlackKingMoveResult = checkMove({ row: 1, col: 0 }, blackKingCheckBoard, ["bKing", { row: 2, column: 0 }]);
    expect(validBlackKingMoveResult).toBeTruthy();
    // todo: show knight move valid
    // todo: show king moves valid
  });
});