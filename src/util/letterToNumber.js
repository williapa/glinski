const letterToNumber = (string) => {
  const row = "ABCDEFGHIJK".indexOf(string.charAt(0));
  const col = parseInt(string.substring(1));
  return { row, col };
};

export default letterToNumber;
