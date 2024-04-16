import React from 'react';
import DraggablePiece from './DraggablePiece';

const ROWS = "ABCDEFGHIJK";

const BoardCell = ({
  cell,
  cellColor,
  from,
  i,
  index,
  isDestination,
  movable,
  onDragOver,
  onDrop,
  onStart,
  pieceColor,
  to,
  turn,
  chatFirst,
}) => (
  <div 
    className={`hex${isDestination ? ' shiny-effect' : ''}${from ? ' from':''}${to? ' to': ''}`}
    style={{ cursor: (movable && pieceColor === (chatFirst ? 'black' : 'white')) ? 'pointer': 'default' }}
  >
    <div 
      className={`${cellColor}a ${isDestination ? 'shiny-font': 'regular-font'}`} 
      style={{ position: "absolute", fontSize: "18px", marginLeft: "33.5px", marginTop: "12px", opacity: 1, zIndex: 999 }}
    >
      {`${ROWS.charAt(index)} ${i}`}
    </div>
    <div className={`top ${cellColor}`}/>
    <div 
      className={`middle ${cellColor}`} 
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
    <div className={`bottom ${cellColor}`}/>
  </div>
);

export default BoardCell;