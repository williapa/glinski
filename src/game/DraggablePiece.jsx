import React from 'react';
import pieceMap from '../util/pieceMap';
import { useDisableClicks } from '../hooks/useDisableClicks';
import { createPieceDragProps } from './dragStrategies';

const BASE_FONT_SIZE = 66;

const getDragPreviewScale = () => {
  if (window.innerWidth > 1923) {
    return .92;
  } else if (window.innerWidth > 1440) {
    return .63;
  } else if (window.innerWidth > 1141) {
    return .55;
  } else if (window.innerWidth > 911 ) {
    return .5;
  } else if (window.innerWidth > 600) {
    return .4;
  }
  return .36; 
}

function DraggablePiece({ turn, onStart, cellContent, row, col, chatFirst, playerCanMove, playerSide }) {
  const { clicksDisabled } = useDisableClicks();
  if (!cellContent) return null;
  const team = cellContent.charAt(0);
  const activePlayerSide = playerSide || (chatFirst ? 'b' : 'w');
  const controlsEnabled = typeof playerCanMove === 'boolean' ? playerCanMove : !clicksDisabled;
  const piece = pieceMap[cellContent];
  const isPawn = !!cellContent && cellContent.substring(1) === "Pawn" ? "pawn safari" : "";
  const canDrag = controlsEnabled && (turn === activePlayerSide) && (team === turn);
  const handleCancel = () => {
    onStart(false);
  }

  const pieceProps = createPieceDragProps({
    canDrag,
    cellContent,
    col,
    dragPreview: {
      piece,
      team,
      fontSize: BASE_FONT_SIZE * getDragPreviewScale(),
    },
    onCancel: handleCancel,
    onStart,
    row,
  });

  return (
    <span className={isPawn} {...pieceProps}>{piece}</span>
  );
}

export default DraggablePiece;
