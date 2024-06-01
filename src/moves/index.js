import getKnightMoves from './getKnightMoves';
import getBishopMoves from './getBishopMoves';
import getPawnMoves from './getPawnMoves';
import getRookMoves from './getRookMoves';
import getQueenMoves from './getQueenMoves';
import getKingMoves from './getKingMoves';

const Moves = {
  Knight: getKnightMoves,
  Bishop: getBishopMoves,
  Pawn: getPawnMoves,
  Rook: getRookMoves,
  Queen: getQueenMoves,
  King: getKingMoves,
};

export default Moves;