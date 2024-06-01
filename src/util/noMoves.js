export default function noMoves(moves) {
  const keys = Object.keys(moves);
  for (let i = 0; i < keys.length; i++) {
    if (moves[keys[i]].length > 0) return false; 
  }
  return true;
};
