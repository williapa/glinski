import parseIrcMessage from './parsedIrcMessage';
import isValidPromotion from './isValidPromotion';
import letterToNumber from './letterToNumber';
import validateMove from "./validateMove";
import playVideo from '../audio/playVideo';
import textToVote from './textToVote';

const COMMANDS_ACK  = 'CAP * ACK :twitch.tv/commands';
const TAGS_ACK = 'CAP * ACK :twitch.tv/tags';
const CHANNEL_SUCCESS = (channel) => (`:justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #${channel.toLowerCase()}`);

let ws = null;

// use web socket to connect to the twitch channel IRC chat
// add moves from chat to the log 
// disconnect when there's no time left
const logChat = (addMessage, board, cancel, channel, enPassantPawnPosition, hilighter, chatFirst, threshold, postMove, opponent) => {
  const moves = {};
  const voters = {};
  const votes = [];
  const movesData = {};

  if (!channel) return;

  if (ws) {
    ws.close();
  }

  ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.onerror = () => {
    console.info("you failed to connect to the web socket.");
    cancel();
  }

  ws.onopen = () => {
    console.log('Connected to Twitch IRC');
    // Anonymous login
    ws.send('PASS none');
    ws.send('NICK justinfan12345');
    ws.send('CAP REQ :twitch.tv/commands');
    ws.send('CAP REQ :twitch.tv/tags');
    ws.send(`JOIN #${channel}`);

    // if the socket connects, also try to get a worker going.
    // is this the wrong way of going about it? 
    // i don't know!
  };

  ws.onmessage = (event) => {
    const message = event.data;

    if (message === 'PING :tmi.twitch.tv') {
      console.log('Received PING, sending PONG...');
      ws.send('PONG :tmi.twitch.tv'); // Responding with PONG to maintain the connection
    }

    if (message.includes(COMMANDS_ACK) && message.includes(TAGS_ACK)) {
      console.log('Command and tag capabilities acknowledged! Joining channel...');
    }

    // confirm successful connect by clearing error
    if (message.startsWith(CHANNEL_SUCCESS(channel))) {
      console.log('Connected to twitch chat.');
    }

    // Basic parsing of IRC message
    const parsedMessage = parseIrcMessage(message, channel);

    // first things first check for error that channel is suspended or doesnt exist
    if (parsedMessage.tags['msg-id'] === 'msg_channel_suspended') {
      console.error('Specified channel is suspended or does not exist (msg_channel_suspended).');
      cancel();
    }

    // Filter for PRIVMSG which indicates a chat message
    if (parsedMessage.command === 'PRIVMSG') {
      // get the message
      const messageText = parsedMessage.trailing.toUpperCase().trim();
      const words = messageText.split(' ');
      console.log(messageText);
      if (!messageText.startsWith("!") || words.length < 1) {
        // not a command, return;
        console.log('(^ this message is not a command. returning.)');
        return;
      }
      // assuming it was a command "move" or "see" let's proceed 
      words.shift();
      const text = words.join(' ');
      const username = parsedMessage.prefix.split('!')[0];
      // test to see if it's a move - for promotion, Q is not included, it's the default for promo 
      if (/^[A-K](?:[0-9]|1[01])\s[A-K](?:[0-9]|1[01])\s?(?:K|B|R)?$/.test(text)) {
        // check to see if it's a valid move - if it's not valid then we bail 
        const startPosition = letterToNumber(text.split(' ')[0]);
        const piece = board[startPosition.row][startPosition.col] || false;
        const endPosition = letterToNumber(text.split(' ')[1]);
        let moveData = {
          board,
          piece,
          startPosition,
          endPosition,
          promoted: false,
          time: new Date().getTime()
        };
         // no piece? break.
        if (!piece) {
          return;
        }
        // incorporate promote data into move if it exists 
        if (text.split(' ').length > 2) {
          moveData.promoted = true;
          moveData.piece = piece.charAt(0) + { b: 'Bishop', k: 'Knight', q: 'Queen', r: 'Rook' }[text[2].toLowerCase()];
        } else if (piece.length > 1 && piece.substring(1) === 'Pawn' && isValidPromotion(board, endPosition.row, endPosition.col, startPosition)) {
          // case: promotion class not specified for a pawn. make it a queen
          moveData.promoted = true;
          moveData.piece = piece.charAt(0) + 'Queen';
        }
        //  invalid move? break.
        if (!validateMove(board, piece, startPosition, endPosition, enPassantPawnPosition, moveData.promoted)) {
          console.log("invalid move.");
          return;
        } else if (chatFirst === (piece.charAt(0) === 'b')) {
          console.log('invalid move due - not player\'s piece');
          return;
        }
        movesData[text] = moveData;
        // const username = parsedMessage.prefix.split('!')[0];
        console.log("valid move from ", username);
        moveData.username = username;
        // add the move to be displayed in the log with the function
        addMessage(moveData);
        votes.push({ ...moveData, username });
        // delete old move if user already voted
        if (voters[username]) {
          moves[voters[username]] = moves[voters[username]].filter((value) => value !== username);
        }
        // set new vote 
        voters[username] = text;
        if (!moves[text]) {
          moves[text] = [username];
        } else if (!moves[text].includes(username)) {
          moves[text].push(username);
        }
        if (moves[text].length >= threshold) {
          console.log("VOTE THRESHOLD ACHIEVED - POSTING MOVE");
          // post move now 
          // todo - need to make sure votes are saved incase the client disconnects 
          // but that's not super important but ideally we want all votes saved in a game history
          // so yeah anyways
          postMove(moveData);
        }
      } else if (/^[A-K](?:[0-9]|1[01])$/.test(text)) {
        const moveToFlash = letterToNumber(text);
        // flash move
        hilighter(moveToFlash.row, moveToFlash.col);
        setTimeout(() => hilighter(false, false), 5900);
        // unflash it after a certain amount of time of course 
      } else if (messageText.startsWith('!VOTE') && username === opponent) {
        // only the player who started the game can change the votes
        textToVote(messageText);
      } else if (messageText.startsWith('!RESIGN')) {
        // post move for other team to win 
        postMove({ winner: chatFirst ? 'b': 'w' });
      } else if (['!CHICKENS', '!DOWORK', '!22S', '!DIRTYGIRL', '!TIMETRAVEL'].includes(messageText)) {
        playVideo(messageText.substring(1).toLowerCase());
      }
    }
  };

  return ws;
};

export default logChat;
