import React from 'react';

const pieceShapes = {
  Pawn: (
    <>
      <circle cx="32" cy="16" r="8" />
      <path d="M25 42c1-5 3-9 5-12h4c2 3 4 7 5 12H25Z" />
      <path d="M21 47c0-3 2-5 5-5h12c3 0 5 2 5 5H21Z" />
    </>
  ),
  Knight: (
    <>
      <path d="M21 43c1-8 5-14 12-19l-8-2 5-11 3 5 10 4c5 4 7 12 3 18l-3 5H21Z" />
      <circle className="chess-piece-detail chess-piece-detail-fill" cx="39" cy="25" r="1.7" />
      <path className="chess-piece-detail" d="M31 31c5 1 8 0 11-3" />
    </>
  ),
  Bishop: (
    <>
      <path d="M32 9c8 7 12 13 12 20 0 6-4 10-9 13h-6c-5-3-9-7-9-13 0-7 4-13 12-20Z" />
      <path className="chess-piece-detail" d="m36 17-9 14" />
      <path d="M22 42h20l3 6H19l3-6Z" />
    </>
  ),
  Rook: (
    <>
      <path d="M19 11h7v6h5v-6h7v6h7v10l-5 5 2 11H22l2-11-5-5V11Z" />
      <path className="chess-piece-detail" d="M24 32h16" />
      <path d="M20 43h24l3 6H17l3-6Z" />
    </>
  ),
  Queen: (
    <>
      <circle cx="18" cy="14" r="3" />
      <circle cx="32" cy="9" r="3" />
      <circle cx="46" cy="14" r="3" />
      <path d="m19 18 8 9 5-13 5 13 8-9-4 24H23l-4-24Z" />
      <path className="chess-piece-detail" d="M23 36h18" />
      <path d="M21 42h22l3 7H18l3-7Z" />
    </>
  ),
  King: (
    <>
      <path d="M29 7h6v7h6v6h-6v7h-6v-7h-6v-6h6V7Z" />
      <path d="M21 30c3-5 7-7 11-7s8 2 11 7l-4 12H25l-4-12Z" />
      <path className="chess-piece-detail" d="M24 32h16" />
      <path d="M22 42h20l3 7H19l3-7Z" />
    </>
  ),
};

function ChessPiece({ piece }) {
  const pieceType = piece?.substring(1);

  if (!pieceShapes[pieceType]) return null;

  return (
    <svg
      aria-hidden="true"
      className="chess-piece-svg"
      focusable="false"
      viewBox="0 0 64 64"
    >
      {pieceShapes[pieceType]}
      <path d="M17 49h30c3 0 5 2 5 5v3H12v-3c0-3 2-5 5-5Z" />
      <path className="chess-piece-detail" d="M15 54h34" />
    </svg>
  );
}

export default ChessPiece;
