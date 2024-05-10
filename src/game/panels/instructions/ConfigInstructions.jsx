const ConfigInstructions = () => (
  <>
    <li key="bdg" className="moveLog-item instruction">
      ▶️
      <i><b>!play</b> - <br/> start a new game.</i>
    </li>
    <li key="bdh" className="moveLog-item instruction">
      ⏱️
      <i><b>!minutes #</b> - <br/> set clocks to # minutes</i>.
    </li>
    <li key="bdi" className="moveLog-item instruction">
      🗳️
      <i> <b>!votes #</b> - <br/> 1st move to get # votes is selected. </i>
    </li>
    <li key="bdj" className="moveLog-item instruction">
      ⬛<i><b>!black</b></i> or ⚪<i><b>!white</b> - <br/> choose chat piece color.</i>
    </li>
  </>
);

export default ConfigInstructions;
