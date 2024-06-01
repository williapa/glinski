export default function newBoard() {
  return [
    [0,0,0,0,0,0],
    ["bPawn",0,0,0,0,0,"wPawn"],
    ["bRook","bPawn",0,0,0,0,"wPawn","wRook"],
    ["bKnight",0,"bPawn",0,0,0,"wPawn",0,"wKnight"],
    ["bKing",0,0,"bPawn",0,0,"wPawn",0,0,"wKing"],
    ["bBishop","bBishop","bBishop",0,"bPawn",0,"wPawn",0,"wBishop","wBishop","wBishop"],
    ["bQueen",0,0,"bPawn",0,0,"wPawn",0,0,"wQueen"],
    ["bKnight",0,"bPawn",0,0,0,"wPawn",0,"wKnight"],
    ["bRook","bPawn",0,0,0,0,"wPawn","wRook"],
    ["bPawn",0,0,0,0,0,"wPawn"],
    [0,0,0,0,0,0],
  ];
}