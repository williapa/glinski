/* eslint-disable no-restricted-globals */
import findBestMove from "./findBestMove";
import getColorMoves from "./getColorMoves";
import applyMove from "./applyMove";
import evaluateBoard from "./evaluateBoard";

const depth = 3;
const disableChatDepth = 0;
const whiteHalfMoves = 5; // 5; (white makes 3 moves) (white half-moves are odd #1,3,5)
const blackHalfMoves = 2;  // 2; black makes 1 move (half-move #2)

addEventListener("message", async ({ data }) => {
  const { board, capturedPieces, chatFirst, enPassantPawnPosition, isChatsMove, halfMoves } = data;
  const initialScore = evaluateBoard(board);
  // todo: random first move if chat & white
  // todo: random (pro) first move if not chat & white
  // half moves is zero based whereas i made the constant non-zero based. why? dont ask questions.
  const isWhiteTurn = (chatFirst === isChatsMove);
  const randomStartingMoves = (isWhiteTurn)? whiteHalfMoves : blackHalfMoves;
  if (halfMoves < randomStartingMoves) {
    const moves = getColorMoves(board, (chatFirst === isChatsMove) ? 'w': 'b', enPassantPawnPosition);
    const random = Math.floor(Math.random() * moves.length);
    const boardResultFromRandomMove = applyMove(board, capturedPieces, moves[random], enPassantPawnPosition);
    const newScore = initialScore + boardResultFromRandomMove.scoreDelta;
    // const score = evaluateBoard(boardResultFromRandomMove.newBoard);
    postMessage([newScore, moves[random], true]);
  } else {
    // note, using chatFirst since always asking for non chat move so can use this + depth to figure out move
    const bestMove = findBestMove(board, capturedPieces, chatFirst, (depth - (isChatsMove ? disableChatDepth: 0)), enPassantPawnPosition, isChatsMove, initialScore);
    // Post data back to the main thread
    postMessage(bestMove);
    close();
  }
});
