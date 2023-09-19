import React from "react";
import pieceMap from "../util/pieceMap";

const CapturedPieces = ({ capturedPieces }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    marginTop: '2rem'
  }}>
    <div style={{ minWidth: "50%", maxWidth: "50%" }}>
      { capturedPieces.w.map((piece, i) => (<span key={i}> { pieceMap[piece] } </span>)) }
    </div>
    <div style={{ minWidth: "50%", maxWidth: "50%" }}>
      { capturedPieces.b.map((piece, i) => (<span key={i}> { pieceMap[piece] } </span>)) }
    </div>
  </div>
);

export default CapturedPieces;