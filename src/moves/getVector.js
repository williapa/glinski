export default function getVector(startingRow, startingColumn, direction) {
  let newRow = startingRow;
  let newColumn = startingColumn;

  switch (direction) {
    case "NW":
      newRow--;
      if (startingRow <= 5) newColumn--; // Northern neighbor has more columns for rows 6-10
      break;
    case "NE":
      newRow--;
      if (startingRow > 5) newColumn++; // Northern neighbor has less columns for rows 0-5
      break;
    case "E":
      newColumn++;
      break;
    case "SE":
      newRow++;
      if (startingRow < 5) newColumn++; // Southern neighbor has more columns for rows 0-4
      break;
    case "SW":
      newRow++;
      if (startingRow >= 5) newColumn--; // Southern neighbor has fewer columns for rows 0-5
      break;
    case "W":
      newColumn--;
      break;
    default: 
      console.error('something is wrong with the vectors');
  }
  const maxCol = Math.abs(newRow - 5);
  if (newRow < 0 || newRow > 10 || newColumn < 0 || newColumn > (10 - maxCol))
    return false;

  return { row: newRow, col: newColumn };
}
