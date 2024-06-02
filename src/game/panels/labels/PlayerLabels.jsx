import React, { useEffect, useState } from 'react';
import PlayerLabel from './PlayerLabel';

const minVotesToSayAndChat = 1;

const PlayerLabels = ({ chatFirst, check, id, opponent, gameOver, turn }) => {
  const [ids, setIds] = useState({
    'b': chatFirst ? id : opponent,
    'w': chatFirst ? opponent: id
  });

  useEffect(() => {
    const votes = document.getElementById('votes').value;
    const opp = `${opponent.length ? opponent : '𝕔𝕙𝕒𝕥'}${(opponent.length && votes >= minVotesToSayAndChat) ? ' & 𝕔𝕙𝕒𝕥': opponent.length ? ' & 𝐻𝑒𝑥𝑄𝐶' : ''}`;
    setIds({
      'b': chatFirst ? id : opp,
      'w': chatFirst ? opp: id
    });
  }, [chatFirst, id, opponent, gameOver]);
  
  return (
    <>
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='b' />
      <PlayerLabel check={check} turn={turn} gameOver={gameOver} ids={ids} side='w' />
    </>
  );
};

export default PlayerLabels;
