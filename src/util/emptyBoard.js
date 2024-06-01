// starting to try to write it so the hexagonal board could be other dimensions 
export default function emptyBoard(sideLength = 6) {
  return new Array(sideLength * 2 - 1).fill(0).map((value, index) => {
    if (index < (sideLength)) {
      return new Array(sideLength + index).fill(0);
    }
    return new Array(3 * sideLength - (index + 2))
  });
}
