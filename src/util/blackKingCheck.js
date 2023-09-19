export default function blackKingCheck () {
  const blackKingMovesLimitedByRookAndQueenWithMultiplePiecesStillHavingPossibleMoves = [
    [0,0,0,0,0,0],
    [0,"bKnight",0,0,0,0,0],
    ["bKing",0,0,0,"wRook",0,"wPawn",0],
    [0,0,"bPawn",0,0,0,"wPawn",0,0],
    [0,0,0,"bPawn",0,"bPawn",0,0,0,"wKing"],
    ["bBishop","bBishop","bBishop",0,0,0,"wPawn",0,0,0,"wBishop"],
    ["bQueen",0,0,"bPawn","wKnight",0,"wPawn",0,0,"wQueen"],
    ["bKnight",0,"bPawn",0,0,0,"wPawn",0,"wKnight"],
    ["bRook","bPawn",0,0,0,0,"wPawn",0],
    ["bPawn",0,0,0,0,0,"wPawn"],
    [0,0,0,0,0,0]
  ];
  return blackKingMovesLimitedByRookAndQueenWithMultiplePiecesStillHavingPossibleMoves;
}
