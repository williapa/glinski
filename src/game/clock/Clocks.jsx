import React, { useEffect, useRef, useState } from 'react';
import Clock from "./Clock";
import calculateRemainingTime from "../../util/calculateRemainingTime";

const Clocks = ({
  chatFirst,
  endGame, 
  gameOver,
  moves,
  startTime,
  turn,
  turnMins,
}) => {
  const timerRef = useRef(null);
  const [blackRemainingSeconds, setBlackRemainingTime] = useState(turnMins * 60);
  const [whiteRemainingSeconds, setWhiteRemainingTime] = useState(turnMins * 60);

  useEffect(() => {
    // Function to start the timer
    const startTimer = () => {
      if (timerRef.current === null) {
        console.log('starting timer');
        timerRef.current = setInterval(() => {
          const gameConfig = { startTime, turnMins };
          const blackRemainingTime = calculateRemainingTime(moves, gameConfig, 'b');
          const whiteRemainingTime = calculateRemainingTime(moves, gameConfig, 'w');
          console.log(whiteRemainingTime);
          console.log(blackRemainingTime);
          console.log(turn);
          // if "player" (white or black?) remaining time is 0 now, post end game + loss. 
          // -3 is hack to avoid collision 
          if (turn === (chatFirst ? 'b' : 'w') && (chatFirst ? blackRemainingTime : whiteRemainingTime) < -3) {
            endGame(turn === 'b' ? 'w' : 'b');
            console.log('stopping timer within timer');
            stopTimer();
            // hacky, waiting extra 3 seconds on chat's turn in case server response is slow to end game
          } /* else if (turn === (chatFirst ? 'w': 'b') && (chatFirst ? whiteRemainingTime : blackRemainingTime) < -5) {
            endGame(turn === 'b' ? 'w' : 'b');
            console.log('stopping timer within timer');
            stopTimer();
          } */
          setBlackRemainingTime(Math.max(0, blackRemainingTime));
          setWhiteRemainingTime(Math.max(0, whiteRemainingTime));
        }, 1000);
      }
    };
  
    // Function to stop the timer
    const stopTimer = () => {
      if (timerRef.current !== null) {
        console.log("this time it actually stopped.");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  
    // Conditionally start or stop the timer based on gameOver
    if (!gameOver) {
      startTimer();
    } else {
      console.log('stopping timer because of game over');
      stopTimer();
    }
  
    // Cleanup function to clear the interval when the component unmounts
    return () => stopTimer();
  }, [chatFirst, endGame, gameOver, moves, startTime, turn, turnMins /*, blackRemainingSeconds, whiteRemainingSeconds*/]);
  

  return (
    <>
      <Clock side="left" time={blackRemainingSeconds} />
      <Clock side="right" time={whiteRemainingSeconds}/>
    </>
  );
};

export default Clocks;
