import hashBoard from "./hashBoard";

const isOdd = (num) => ((num % 2) ? 'w' : 'b');

// the new hash does not incorporate the move # yet. add that in in the fn here
const hashRepeatedThrice = (board, currentMovesLength, hashTable) => {
  const key = `${isOdd(currentMovesLength)}${hashBoard(board)}`;
  if (hashTable[key] === 2) {
    console.log('Tie game: repeat hash state.');
    hashTable[key] += 1;
    return [true, hashTable];
  } else if (hashTable[key] === 1) {
    hashTable[key] += 1;
  } else {
    hashTable[key] = 1;
  }
  return [false, hashTable];
}

export default hashRepeatedThrice;
