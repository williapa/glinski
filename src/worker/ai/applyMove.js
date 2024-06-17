import calculateMoveDelta from "./calculateMoveDelta";

const applyMove = (board, capturedPieces, coords, enPassantPawnPosition, wasEndGameAtMoveStart) => {
  let enPassantCaptureFlag = false;
  const { startPosition, endPosition, promotion } = coords;
  const startingPiece = board[startPosition.row][startPosition.column];
  const piece = promotion || startingPiece;
  const turn = piece.charAt(0);
  let removedPiece = board[endPosition.row][endPosition.col];
  const newBoard = board.map((row) => [...row]);
  const newCapturedPieces = {
    b: [...capturedPieces.b],
    w: [...capturedPieces.w],
  };
  let newEnPassantPawnPosition = enPassantPawnPosition ? {
    ...enPassantPawnPosition
  } : false;

  if (enPassantPawnPosition) {
    // white direction is negative 1, so add negative 1 to the column and if this is the dest, remove the en passant pawn
    // black direction is positive 1, so add 1 to the column and if it is the dest, remove the en passant pawn. 
    // and make sure to identify the en passant pawn as the removed piece so the logic below tracks the killed pieces
    const dir = turn === 'w' ? 1 : -1;
    if (enPassantPawnPosition.row === endPosition.row && enPassantPawnPosition.col  === endPosition.col + dir) {
      removedPiece = board[enPassantPawnPosition.row][enPassantPawnPosition.col];
      newBoard[enPassantPawnPosition.row][enPassantPawnPosition.col] = 0;
      enPassantCaptureFlag = enPassantPawnPosition;
    }
  }
  // now clear enPassantPosition
  newEnPassantPawnPosition = false;
  // track captured pieces
  if (removedPiece) {
    newCapturedPieces[removedPiece.charAt(0)].push(removedPiece);
  }
  // check new move for en passant pawn. This means the piece is a pawn and the column is changing by more than 1
  if (board[startPosition.row][startPosition.column].substr(1) === "Pawn" && Math.abs(endPosition.col - startPosition.col) > 1) {
    newEnPassantPawnPosition = { row: endPosition.row, col: endPosition.col };
  }
  newBoard[startPosition.row][startPosition.column] = 0;
  newBoard[endPosition.row][endPosition.col] = piece;
  const scoreDelta = calculateMoveDelta(coords, startingPiece, piece, removedPiece, wasEndGameAtMoveStart, enPassantCaptureFlag);
  return { newBoard, newCapturedPieces, newEnPassantPawnPosition, removedPiece, scoreDelta, startingPiece };
}

export default applyMove;
