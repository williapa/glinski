const letterToNumber = (string) => {
  const row = "KJIHGFEDCBA".indexOf(string.charAt(0));
  const col = parseInt(string.substring(1));
  return { row, col };
};

export default letterToNumber;
