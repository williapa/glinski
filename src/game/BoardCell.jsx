import React from 'react';
import DraggablePiece from './DraggablePiece';

const ROWS = "ABCDEFGHIJK";

const BoardCell = ({
  cell,
  cellColor,
  i,
  index,
  isDestination,
  movable,
  onDragOver,
  onDrop,
  onStart,
  pieceColor,
  turn,
  chatFirst,
}) => (
  <div 
    className={`hex`}
    style={{ cursor: (movable) ? 'pointer': 'default' }}
  >
    <div 
      className={isDestination ? 'shiny-font': 'regular-font'} 
      style={{ position: "absolute", fontSize: "18px", marginLeft: "39px", marginTop: "12px", opacity: 1, zIndex: 999 }}
    >
      {`${ROWS.charAt(index)} ${i}`}
    </div>
    <div className={`top ${cellColor}  ${isDestination ? 'shiny-effect' : ''}`}/>
    <div 
      className={`middle ${cellColor}  ${isDestination ? 'shiny-effect' : ''}`} 
      style={{ color: pieceColor }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <DraggablePiece 
        turn={turn}
        onStart={onStart}
        cellContent={cell}
        row={index}
        col={i}
        chatFirst={chatFirst}
      />
    </div>
    <div className={`bottom ${cellColor}  ${isDestination ? 'shiny-effect' : ''}`}/>
  </div>
);

export default BoardCell;