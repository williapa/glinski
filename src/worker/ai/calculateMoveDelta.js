import pieceValues from "./pieceValues";
import positionIncentives from "./positionIncentives";
// newPiecePositionIncentiveValue - OldPiecePositionIncentiveValue + capturedPieceValue + capturedPiecePositionIncentiveValue;
// promotion is special case - should compute newPiece ahead, then use for newPiecePositionIncentive. then finally, if promoted, add / subtact piece vals.
// coords: -startPosition:  -row,  -column:, -endPosition: -row, -col::
// todo: does not encapsulate "endgame" consideration for king 
const calculateMoveDelta = (coords, startingPiece, endingPiece, removedPiece, wasEndGameAtMoveStart, enPassantCaptureFlag) => {
  const { startPosition, endPosition } = coords;
  let epke = '';
  if (endingPiece.substring(1) === 'King' && wasEndGameAtMoveStart) {
    epke = 'Endgame';
  }
  let spke = '';
  if (startingPiece.substring(1) === 'King' && wasEndGameAtMoveStart) {
    spke = 'Endgame';
  }
  let delta = positionIncentives[`${endingPiece}${epke}`][endPosition.row][endPosition.col] - 
    positionIncentives[`${startingPiece}${spke}`][startPosition.row][startPosition.column];
  if (removedPiece) {
    delta += pieceValues[removedPiece.substring(1)];
    if (enPassantCaptureFlag) {
      // position is different
      delta += positionIncentives[removedPiece][enPassantCaptureFlag.row][enPassantCaptureFlag.col];
    } else {
      delta += positionIncentives[removedPiece][endPosition.row][endPosition.col];
    }
  }
  // negative for black since eval is done by white - black 
  return startingPiece.charAt(0) === 'w' ? delta : -delta;

};

export default calculateMoveDelta;
