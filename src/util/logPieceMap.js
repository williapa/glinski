const logPieceMap = {
  "bPawn": '♟︎',
  "bKnight":'♞',
  "bBishop":'♝',
  "bKing": '♚',
  "bQueen": '♛',
  "bRook":'♜',
  "wPawn":'♙',  // ♙
  "wKnight":'♘', // ♘
  "wBishop": '♗', // ♗
  "wKing": '♔', // ♔
  "wQueen": '♕', // ♕
  "wRook": '♖' // ♖
}; // i created a separate logPieceMap that uses the correct colors, whereas PieceMap leverages all black emoji pieces, and then uses color: white for the white pieces

export default logPieceMap;
