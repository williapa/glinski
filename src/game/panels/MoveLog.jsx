import React, { useEffect, useRef, useState } from 'react';
import LogLabel from './labels/LogLabel';
import MoveLogConfigControls from './controls/MoveLogConfigControls';
import letChatStartGame from '../../util/letChatStartGame';
import logChat from '../../util/logChat';
import logPieceMap from '../../util/logPieceMap';
import rowColToLetterCol from '../../util/rowColToLetterCol';

const MoveLog = ({
  ai,
  aiEnabled,
  board,
  channel,
  chatFirst,
  colorChoice,
  enPassantPawnPosition,
  gameOver,
  hilighter,
  initialVotes,
  moves,
  onSwitchPlayerColor,
  onToggleAi,
  onUpdateTurnMins,
  onUpdateVoteThreshold,
  opponent,
  postMove,
  useMuted,
  setColorChoice,
  setFlash,
  startGame,
  startTime,
  turnMins,
  voteThreshold,
}) => {
  const [votes, setVotes] = useState(initialVotes);
  const [socket, setSocket] = useState(null);
  const [startGameSocket, setStartGameSocket] = useState(null);
  const [startGameInterval, setStartGameInterval] = useState(null);
  const topRef = useRef(null);

  const addVote = (newVote) => {
    const { startPosition, endPosition } = newVote;
    // TODO: when a vote is added we hilight animation
    setFlash({ startPosition, endPosition });
    setVotes((prev) => ([
      newVote,  
      ...prev
    ]));
  };

  const cancel = (reset) => {
    setSocket(null);
    if (reset) {
      console.log('the socket was cancelled due to an error. retrying (with delay)');
      setTimeout(() => {
        kickOff();
      }, 10000);
    }
  }

  const kickOff = () => {
    const [i,s] = letChatStartGame(wrapSocketStartGame, cancel, channel, setColorChoice, onUpdateVoteThreshold);
    setStartGameSocket(s);
    setStartGameInterval(i);
  }

  const hoverMove = (s, e) => {
    setFlash({ startPosition: s, endPosition: e });
  }

  const scrollToBottom = () => {
    if (topRef.current) {
      topRef.current.scrollTo({ top: topRef.current.scrollHeight, behavior: 'smooth' }); // Scrolls to the top of the chat box
    }
  };

  // ugly, but done to clear votes from old game 
  const wrapStartGame = (args) => {
    setVotes([]);
    startGame(args)
  }

  const wrapSocketStartGame = (username) => {
    setVotes([]);
    setSocket(null);
    clearInterval(startGameInterval);
    setStartGameInterval(null);
    startGame({ preventDefault: () => {} }, username);
  }

  // use moves length as a trigger for the channel hook, kill it if 
  useEffect(() => {
    // use moves length to determine if chat turn
    const chatTurn = !(moves.length % 2) === chatFirst && !gameOver;
    const voteThresholdForAiMove = document.getElementById("votes").value;
    if (chatTurn && voteThresholdForAiMove < 1) {
      console.log('chat ai move!');
      // todo: could just 'arg' here to tell whose move it is
      // this is async but it will clean itself up once it posts the move
      ai(true);
    } else if (chatTurn && !socket) {
    // open socket if chat turn & no socket 
      console.log('start log chat');
      const thresh = document.getElementById("votes").value;
      const webSocket = logChat(addVote, board, () => setSocket(null), channel, enPassantPawnPosition, hilighter, chatFirst, thresh, postMove, opponent, onUpdateVoteThreshold);
      setSocket(webSocket);
    } else if (socket && (!chatTurn || gameOver)) {
      console.log('stop log chat');
      // close socket if not chat turn && still socket 
      socket.close();
      setSocket(null);
    }
    if (gameOver && !startGameSocket) {
      // setstartgamesocket and letchatstartgame
      const [i,s] = letChatStartGame(wrapSocketStartGame, () => setStartGameSocket(null), channel, setColorChoice, onUpdateVoteThreshold);
      setStartGameSocket(s);
      setStartGameInterval(i);
    } else if (!gameOver && startGameSocket) {
      // kill it 
      startGameSocket.close();
      setStartGameSocket(null);
      // and the interval
      clearInterval(startGameInterval);
      setStartGameInterval(null);
    } 
    // cleanup - close socket
    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      if (startGameSocket) {
        startGameSocket.close();
        setStartGameSocket(null);
        clearInterval(startGameInterval);
        setStartGameInterval(null);
      }
    };
  }, [board, channel, chatFirst, enPassantPawnPosition, gameOver, moves, onUpdateVoteThreshold, socket]);

  useEffect(() => {
    setVotes([...initialVotes]);
  }, [initialVotes]);

  useEffect(() => scrollToBottom(), [moves, gameOver]);

  const movesAndVotes = moves.concat(votes).sort((a, b) => a.time - b.time);
  const canConfigureGame = !!gameOver;
  const playerColorIsBlack = colorChoice === 'black';
  
  return (
    <div className="moveLog">
      <LogLabel useMuted={useMuted} startGame={wrapStartGame} gameOver={gameOver} turnCount={moves.length} />
      <ul ref={topRef} className="moveLog-list">
        { startTime  ? (
          <li className="moveLog-item">
            <span className="timeLabel">{new Date(startTime).toLocaleTimeString()} </span>
            <span> Game started. </span>
          </li>
        ) : '' }
        {movesAndVotes.map((move, index) => (
          <li key={index} className={`moveLog-item ${move.piece.charAt(0)}`} onMouseEnter={() => hoverMove(move.startPosition, move.endPosition)}>
            { move.username ? 
              (
                <span>
                  <span className="timeLabel user"> {move.username} </span>
                  { 'voted for '}
                </span>
              ) : <span className="timeLabel">{new Date(move.time).toLocaleTimeString()} </span>
            }
            {move.promoted ? <span>Promotion to </span> : ''}
            <span>{logPieceMap[move.piece]} </span>
            <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
            <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
            {move.removedPiece ? <span> taking {logPieceMap[move.removedPiece]}</span> : ''}.
            { move.check ? <span> {move.piece.charAt(0) === 'b' ? 'white' : 'black' } is in check. </span> : '' }
            { move.isRandom ? <span> 🎲 </span> : '' }
          </li>
        ))}
        { (gameOver === 'b' || gameOver === 'w' || gameOver === 'tie') ? 
          (
            <li key="f" className="moveLog-item">
              <i>
              {
                {'w': 'White wins!', 'b': 'Black wins!', 'tie': 'Draw :/' }[gameOver]
              }
              </i>
            </li>
          ) : ''
        }
      </ul>
      <MoveLogConfigControls
        aiEnabled={aiEnabled}
        canConfigureGame={canConfigureGame}
        isGameActive={!gameOver}
        onStartGame={wrapStartGame}
        onSwitchPlayerColor={onSwitchPlayerColor}
        onToggleAi={onToggleAi}
        onUpdateTurnMins={onUpdateTurnMins}
        onUpdateVoteThreshold={onUpdateVoteThreshold}
        playerColorIsBlack={playerColorIsBlack}
        showAiToggle
        turnMins={turnMins}
        voteThreshold={voteThreshold}
      />
    </div>
  );
};

export default MoveLog;
