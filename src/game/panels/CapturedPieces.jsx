import React from "react";
import logPieceMap from "../../util/logPieceMap";

const CapturedPieces = ({ capturedPieces }) => (
  <div className="captureContainer">
    <div className="left capture" style={{color: "#ddd"}}>
      { capturedPieces.w.map((piece, i) => (<span key={i}> { logPieceMap[piece] } </span>)) }
    </div>
    <div className="right capture" style={{color: "#222"}} >
      { capturedPieces.b.map((piece, i) => (<span key={i}> { logPieceMap[piece] } </span>)) }
    </div>
  </div>
);

export default CapturedPieces;