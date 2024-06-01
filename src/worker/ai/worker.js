/* eslint-disable no-restricted-globals */
import findBestMove from "./findBestMove";
import getColorMoves from "./getColorMoves";

const depth = 3;
const disableChatDepth = 0;
const whiteHalfMoves = 5; //(white makes 3 moves)
const blackHalfMoves = 2; // black makes 1 move

addEventListener("message", async ({ data }) => {
  const { board, capturedPieces, chatFirst, enPassantPawnPosition, isChatsMove, halfMoves } = data;
  // todo: random first move if chat & white
  // todo: random (pro) first move if not chat & white
  // half moves is zero based whereas i made the constant non-zero based. why? dont ask questions.
  const isWhiteTurn = (chatFirst === isChatsMove);
  const randomStartingMoves = (isWhiteTurn)? whiteHalfMoves : blackHalfMoves;
  if (halfMoves < randomStartingMoves) {
    const moves = getColorMoves(board, (chatFirst === isChatsMove) ? 'w': 'b', enPassantPawnPosition);
    const random = Math.floor(Math.random() * moves.length);
    postMessage(['random', moves[random]]);
  } else {
    // note, using chatFirst since always asking for non chat move so can use this + depth to figure out move
    const bestMove = findBestMove(board, capturedPieces, chatFirst, (depth - (isChatsMove ? disableChatDepth: 0)), enPassantPawnPosition, isChatsMove);
    // Post data back to the main thread
    postMessage(bestMove);
    close();
  }
});
