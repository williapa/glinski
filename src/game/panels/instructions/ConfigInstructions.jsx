import TwitchSeparator from './TwitchSeparator';

const ConfigInstructions = () => (
  <>
    <span className="space" >
      <span> 😎 </span>
      <i><b>!g</b> - start game in </i> 𝙜𝙪𝙞𝙙𝙚𝙙 <i> mode with </i> 𝙃𝙚𝙭𝙌𝘾 <i> on chat's team.  </i>
    </span>
    <TwitchSeparator />
    <span className="space" >
      <span> ▶️ </span>
      <i><b>!play</b> - start a new game. </i>
    </span>
    <TwitchSeparator />
    <span className="space">
      <span> ⏱️ </span> 
      <i><b>!minutes #</b> - set clock <b> # </b> minutes</i>. 
    </span>
    <TwitchSeparator />
    <span className="space">
      <span> 🗳️ </span> 
      <i> <b>!votes #</b> - first move to <b> # </b> votes is selected. </i>
    </span>
    <TwitchSeparator />
    <span className="space">
      <span> ⬛ </span>
    <i> <b>!black</b> </i> or <span> ⚪ </span> <i> <b>!white</b> - choose chat's piece color. </i>
    </span>
    <TwitchSeparator />
  </>
);

export default ConfigInstructions;
