import findBestMove from "./findBestMove";

// todo: try 6 
const depth = 4;

export default () => {
  self.addEventListener('message', ({ data }) => {
    const { board, capturedPieces, chatFirst, enPassantPawnPosition } = data;
    // note, using chatFirst since always asking for non chat move so can use this + depth to figure out move
    const bestMove = findBestMove(board, capturedPieces, chatFirst, depth, enPassantPawnPosition);
    // Post data back to the main thread
    postMessage(bestMove);
  });
};