import React, { useEffect, useRef, useState } from 'react';
import LogLabel from './labels/LogLabel';
import letChatStartGame from '../util/letChatStartGame';
import logChat from '../util/logChat';
import pieceMap from '../util/pieceMap';
import rowColToLetterCol from '../util/rowColToLetterCol';

const MoveLog = ({
  ai,
  board,
  channel,
  chatFirst,
  enPassantPawnPosition,
  gameOver,
  initialVotes,
  moves,
  polling,
  useMuted,
  setColorChoice,
  setFlash,
  startGame,
  startTime,
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

  const hoverMove = (s, e) => {
    setFlash({ startPosition: s, endPosition: e });
  }

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollTop = 0; // Scrolls to the top of the chat box
    }
  };

  // ugly, but done to clear votes from old game 
  const wrapStartGame = (args) => {
    setVotes([]);
    startGame(args)
  }

  const wrapSocketStartGame = (username) => {
    setVotes([]);
    startGame({ preventDefault: () => {} }, username);
  }

  // use moves length as a trigger for the channel hook, kill it if 
  useEffect(() => {
    // use moves length to determine if chat turn
    const chatTurn = !(moves.length % 2) === chatFirst && !gameOver;
    // open socket if chat turn & no socket 
    if (chatTurn && !socket && !polling) {
      console.log('start log chat');
      const webSocket = logChat(addVote, board, () => setSocket(null), channel, enPassantPawnPosition);
      setSocket(webSocket);
    } else if (socket && (!chatTurn || polling || gameOver)) {
      console.log('stop log chat');
      // close socket if not chat turn && still socket 
      socket.close();
      setSocket(null);
    }
    if (gameOver && !startGameSocket) {
      // setstartgamesocket and letchatstartgame
      const [i,s] = letChatStartGame(wrapSocketStartGame, () => setStartGameSocket(null), channel, setColorChoice);
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
  }, [board, channel, chatFirst, enPassantPawnPosition, gameOver, moves, polling, socket]);

  useEffect(() => {
    setVotes([...initialVotes]);
  }, [initialVotes]);

  useEffect(() => scrollToTop(), [moves]);
  
  const movesAndVotes = moves.concat(votes).sort((a, b) => b.time - a.time);
  
  return (
    <div className="moveLog">
      <LogLabel useMuted={useMuted} startGame={wrapStartGame} gameOver={gameOver} turnCount={moves.length} />
      <ul ref={topRef} className="moveLog-list">
      { (gameOver === 'b' || gameOver === 'w') ? 
          (
            <li key="bdf" className="moveLog-item">
              Type "play" to play a new game.
            </li>
          ) : ''
        }
        { (gameOver === 'b' || gameOver === 'w') ? 
          (
            <li key="f" className="moveLog-item">
              {
                {'w': 'White', 'b': 'Black' }[gameOver] + ' wins!'
              } 
            </li>
          ) : ''
        }
        { (gameOver === 'tie') ? 
          (
            <li key="t" className="moveLog-item">
              Tie game!
            </li>
          ) : ''
        }
        <button style={{ display: 'none' }} onClick={ai}> refresh </button>
        { polling? <li key="r" className="moveLog-item">Reconnecting to chat...</li> : ''}
        {movesAndVotes.map((move, index) => (
          <li key={index} className="moveLog-item" onMouseEnter={() => hoverMove(move.startPosition, move.endPosition)}>
            { move.username ? 
              (
                <span>
                  <span className="timeLabel user"> {move.username} </span>
                  { 'voted for '}
                </span>
              ) : <span className="timeLabel">{new Date(move.time).toLocaleTimeString()} </span>
            }
            {move.promoted ? <span>Promotion to </span> : ''}
            <span>{pieceMap[move.piece]} </span>
            <span>{rowColToLetterCol(move.startPosition.row, move.startPosition.col)} </span>
            <span>{rowColToLetterCol(move.endPosition.row, move.endPosition.col)}</span>
            {move.removedPiece ? <span> taking {pieceMap[move.removedPiece]}</span> : ''}.
            { move.check ? <span> {move.piece.charAt(0) === 'b' ? 'white' : 'black' } king is in check. </span> : '' }
          </li>
        ))}
        { startTime ? (
          <li className="moveLog-item">
            <span className="timeLabel">{new Date(startTime).toLocaleTimeString()} </span>
            <span> Game started. When it's your turn, type coordinates - "B4 B5". </span>
            <span> Promoted pawns default to queens. Or, type the first letter of the piece after the coordinates. </span>
            <span> Good luck! </span>
          </li>): ''
        }
      </ul>
    </div>
  );
};

export default MoveLog;
