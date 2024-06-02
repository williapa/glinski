import React from 'react';
import pieceMap from '../util/pieceMap';
import { useDisableClicks } from '../hooks/useDisableClicks';

const baseFont = 66;

const getMultiple = () => {
  if (window.innerWidth > 1916) {
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

function DraggablePiece({ turn, onStart, cellContent, row, col, chatFirst }) {
  const { clicksDisabled } = useDisableClicks();
  if (!cellContent) return null;
  const team = cellContent.charAt(0);
  const piece = pieceMap[cellContent];
  const isPawn = !!cellContent && cellContent.substring(1) === "Pawn" ? "pawn safari" : "";
  const handleDragStart = (e) => {
    // Create a new element
    if (clicksDisabled) {
      console.log("clicks are disabled so no moves.");
      return;
    }
    if ((chatFirst && turn === 'w') || (!chatFirst && turn === 'b')) {
      console.log("its not your turn so no moves!");
      return;
    }
    const el = document.createElement('span');
    el.textContent = piece; // Set the content to the chess piece
    el.style.background = 'none'; // Set background to none
    el.style.position = 'fixed'; // Set position to fixed to remove from the normal flow
    const multiple = getMultiple();
    el.style.fontSize = `${baseFont * multiple}px`; // set font size of the piece
    el.style.top = '-10000px'; // Position it off-screen
    el.style.color = team === 'w' ? "white" : "#445";
    document.body.appendChild(el); // Append to body

    // Set the created element as the drag image
    const { offsetWidth: width, offsetHeight: height } = el;
    e.dataTransfer.setDragImage(el, width / 2, height / 2);
    e.dataTransfer.setData('application/json', JSON.stringify({ row, col }));
    // hilight cells
    onStart(cellContent);
    // Set a timeout to remove the element on the next event loop after drag has started
    setTimeout(() => {
      document.body.removeChild(el); // Remove the element from the body
    }, 0);
  };

  const handleDragEnd = () => {
    onStart(false);
  }

  return (
    <span className={isPawn} draggable={(turn !== (chatFirst ? 'w' : 'b')) && (team === turn)} onDragStart={handleDragStart} onDragEnd={handleDragEnd} >{piece}</span>
  );
}

export default DraggablePiece;