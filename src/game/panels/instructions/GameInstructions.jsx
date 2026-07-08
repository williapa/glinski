import TwitchSeparator from './TwitchSeparator';

const GameInstructions = () => (
  <>
    <span className="space">
        <span> <span> 💡 </span> <i> <b>!see F10</b> - see allowed moves for your piece. </i> </span>
    </span>
    <TwitchSeparator />
    <span  className="space">
        <span> <span> 🕹️ </span><i> <b>!vote G0 K4</b> - vote for chat's next move. </i> </span>
    </span>
    <TwitchSeparator />
  </>
);

export default GameInstructions;
