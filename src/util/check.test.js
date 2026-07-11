import check from './check';

jest.mock('../moves', () => ({
  __esModule: true,
  default: {
    Rook: () => ({ 1: [1] }),
  },
}));

describe('check', () => {
  test('ignores malformed non-string board cells instead of throwing', () => {
    expect(() => check([[true]], 'w')).not.toThrow();
    expect(check([[true]], 'w')).toBe(false);
  });

  test('uses movement result keys when examining attacked cells', () => {
    const board = [
      ['bRook', 0],
      [0, 'wKing'],
    ];

    expect(check(board, 'w')).toBe(true);
  });
});
