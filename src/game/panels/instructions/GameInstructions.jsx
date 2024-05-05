const GameInstructions = () => (
  <>
    <li className="moveLog-item">
        <span> <b>F10</b> - See piece moves.</span>
    </li>
    <li className="moveLog-item">
        <span> <b>G0 K4</b> - Vote for move. </span>
    </li>
  
    <li className="moveLog-item">
       <b>B1 B0 K</b> - Pawn promotes to queen by default, or choose a piece by letter.
    </li>
  </>
);

export default GameInstructions;
