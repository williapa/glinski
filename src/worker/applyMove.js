const applyMove = (board, capturedPieces, coords, enPassantPawnPosition) => {
  const { startPosition, endPosition } = coords;
  const piece = board[startPosition.row][startPosition.col];
  const turn = piece.charAt(0);
  let removedPiece = board[endPosition.row][endPosition.col];

  if (enPassantPawnPosition) {
    // white direction is negative 1, so add negative 1 to the column and if this is the dest, remove the en passant pawn
    // black direction is positive 1, so add 1 to the column and if it is the dest, remove the en passant pawn. 
    // and make sure to identify the en passant pawn as the removed piece so the logic below tracks the killed pieces
    const dir = turn === 'w' ? 1 : -1;
    if (enPassantPawnPosition.row === endPosition.row && enPassantPawnPosition.col  === endPosition.col + dir) {
      removedPiece = board[enPassantPawnPosition.row][enPassantPawnPosition.col];
      board[enPassantPawnPosition.row][enPassantPawnPosition.col] = 0;
    }
  }
  // now clear enPassantPosition
  enPassantPawnPosition = false;
  // track captured pieces
  if (removedPiece) {
    capturedPieces[removedPiece.charAt(0)].push(removedPiece);
  }
  // check new move for en passant pawn. This means the piece is a pawn and the column is changing by more than 1
  if (board[startPosition.row][startPosition.col].substr(1) === "Pawn" && Math.abs(endPosition.col - startPosition.col) > 1) {
    enPassantPawnPosition = { row: endPosition.row, col: endPosition.col };
  }
  board[startPosition.row][startPosition.col] = 0;
  board[endPosition.row][endPosition.col] = piece;
  return { newBoard: board, newCapturedPieces: capturedPieces, newEnPassantPawnPosition: enPassantPawnPosition };
}

export default applyMove;

