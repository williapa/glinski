import CryptoJS from 'crypto-js';

const hashBoard = (board) => {
  const boardString = board.map((row) => row.join('')).join('');
  // just taking the fastest possible hash algorithm to reduce board state comparison for thrice rule
  const hash = CryptoJS.MD5(boardString).toString();
  return hash;
};

export default hashBoard;
