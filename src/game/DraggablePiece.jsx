import React from 'react';
import { useDisableClicks } from '../hooks/useDisableClicks';
import ChessPiece from './ChessPiece';
import { createPieceDragProps } from './dragStrategies';

function DraggablePiece({ turn, onStart, cellContent, row, col, chatFirst, playerCanMove, playerSide }) {
  const { clicksDisabled } = useDisableClicks();
  if (!cellContent) return null;
  const team = cellContent.charAt(0);
  const activePlayerSide = playerSide || (chatFirst ? 'b' : 'w');
  const controlsEnabled = typeof playerCanMove === 'boolean' ? playerCanMove : !clicksDisabled;
  const canDrag = controlsEnabled && (turn === activePlayerSide) && (team === turn);
  const handleCancel = () => {
    onStart(false);
  }

  const pieceProps = createPieceDragProps({
    canDrag,
    cellContent,
    col,
    onCancel: handleCancel,
    onStart,
    row,
  });

  return (
    <span
      aria-label={`${team === 'w' ? 'White' : 'Black'} ${cellContent.substring(1).toLowerCase()}`}
      className={`chess-piece chess-piece-${team === 'w' ? 'white' : 'black'}`}
      role="img"
      {...pieceProps}
    >
      <ChessPiece piece={cellContent} />
    </span>
  );
}

export default DraggablePiece;
