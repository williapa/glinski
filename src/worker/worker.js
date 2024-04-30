/* eslint-disable no-restricted-globals */
import findBestMove from "./findBestMove";

const depth = 3;

addEventListener("message", async ({ data }) => {
  const { board, capturedPieces, chatFirst, enPassantPawnPosition } = data;
  // note, using chatFirst since always asking for non chat move so can use this + depth to figure out move
  const bestMove = findBestMove(board, capturedPieces, chatFirst, depth, enPassantPawnPosition);
  // Post data back to the main thread
  postMessage(bestMove);
});
