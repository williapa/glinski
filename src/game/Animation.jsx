import { useEffect, useState } from 'react';
import typing from './typing';
import './Animation.css';

const Animation = ({ move }) => {
  // all the stuff that animates when the AI moves
  const [typedMove, setTypedMove] = useState('');
  const [intervalId, setIntervalId] = useState();
  const [sub, setSub] = useState(false);
  // todo: trigger flash on button when move abt to execute
  useEffect(() => {
    if (move && !intervalId) {
      // the interval will cancel itself but track it anyways
      setIntervalId(typing(move, setTypedMove, setSub));
    } else if (!move && intervalId) {
      setIntervalId(null);
      setSub(false);
    }
  }, [move]);

  return (
    <div className={`animation ${move ? 'expand' : ''}`}>
      <input readOnly id="chatMove" value={typedMove}/>
      <button className={`hmm ${sub ? 'send' : ''}`}>MOVE</button>
    </div>
  );
}

export default Animation;
