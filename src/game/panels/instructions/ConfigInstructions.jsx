const ConfigInstructions = () => (
  <>
    <li key="bdg" className="moveLog-item">
      <b>!play</b> - start a new game.
    </li>
    <li key="bdh" className="moveLog-item">
      <b>!minutes 5</b> - set game length <i>(max 14)</i>.
    </li>
    <li key="bdi" className="moveLog-item">
      <b>!votes 1</b> - set number of chat votes required to apply next move <i>(max 5)</i>.
    </li>
    <li key="bdj" className="moveLog-item">
      <b>!random</b>, <b>!stay</b> or <b>!switch</b> - choose a side.
    </li>
  </>
);

export default ConfigInstructions;
