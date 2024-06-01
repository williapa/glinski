import ConfigInstructions from '../instructions/ConfigInstructions';
import GameInstructions from '../instructions/GameInstructions';
import './Ticker.css';

const double = (El) => (
  <>
    <El />
    <El />
  </>
);

const Ticker = ({ gameOver }) => (
  <>
    <div className="commands">Commands: </div> 
    <div className="ticker" >
      <span className="scroller">
        {gameOver ? double(ConfigInstructions) : double(GameInstructions)}
      </span>
    </div>
  </>
);

export default Ticker;