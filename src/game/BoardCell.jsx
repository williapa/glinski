import React from 'react';
import DraggablePiece from './DraggablePiece';

const ROWS = "KJIHGFEDCBA";

function BoardCell(props) {
  const {
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
    playerCanMove,
    playerSide,
    to,
    turn,
    chatFirst,
  } = props;

  const activePlayerSide = playerSide || (chatFirst ? 'b' : 'w');
  const activePlayerColor = activePlayerSide === 'b' ? 'black' : 'white';
  const controlsEnabled = typeof playerCanMove === 'boolean' ? playerCanMove : true;

  return (
  <div 
    className={`hex${isDestination ? ' shiny-effect' : ''}${from ? ' from':''}${to? ' to': ''}`}
    style={{ cursor: (controlsEnabled && movable && pieceColor === activePlayerColor) ? 'pointer': 'default' }}
  >
    <div 
      className={`${cellColor}a ${isDestination ? 'shiny-font': 'regular-font'}`} 
      style={{ position: "absolute", fontSize: "18px", marginLeft: "2px", marginTop: "48px", zIndex: 999 }}
    >
      {`${ROWS.charAt(index)}${i < 10 ? ' ': ''}${i}`}
    </div>
    <div className={`top ${cellColor}`}/>
    <div 
      className={`middle ${cellColor}`} 
      style={{ 
        color: pieceColor === 'white' ? pieceColor : "#445",
        textShadow: `1.5px 1.5px 3px ${pieceColor === 'white' ? 'black': 'lightgrey' }, 1.5px -1.5px 3px ${pieceColor === 'white' ? 'black': 'lightgrey' }, -1.5px 1.5px 3px ${pieceColor === 'white' ? 'black': 'lightgrey' }, -1.5px -1.5px 3px ${pieceColor === 'white' ? 'black': 'lightgrey' }`
      }}
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
        playerCanMove={playerCanMove}
        playerSide={activePlayerSide}
      />
    </div>
    <div className={`bottom ${cellColor}`}/>
  </div>
  );
}

export default BoardCell;
