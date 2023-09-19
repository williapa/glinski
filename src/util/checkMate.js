import Moves from "../moves";
import filterMoves from "./filterMoves";
import noMoves from "./noMoves";

export default function checkMate(realBoard, color, enPassantPawnPosition) {
  
  const board = realBoard.map((row) => row.slice());

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
      const noMovesLeftForThisPiece = noMoves(filteredMoves);
      if (!noMovesLeftForThisPiece) return false;
    }
  }

  return true;
};


// i am building shufflebored.co in public 
// twitch link
// youtube link
// im on a fitness journey 
// loves music comedy & iced coffee 

// bikes
// drones
// music + recording
// comedy + twitch
// weed hehe
// i do like games tbs are my favorite but i like shooters, nintendo type multiplayer games
// 