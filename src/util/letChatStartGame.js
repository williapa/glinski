import parseIrcMessage from './parsedIrcMessage';

const COMMANDS_ACK  = 'CAP * ACK :twitch.tv/commands';
const TAGS_ACK = 'CAP * ACK :twitch.tv/tags';
const CHANNEL_SUCCESS = (channel) => (`:justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #${channel.toLowerCase()}`);

let ws = null;

// use web socket to connect to the twitch channel IRC chat
// add moves from chat to the log 
// disconnect when there's no time left
const internalLetChatStartGame = (startGame, cancel, channel, setColorChoice) => {

  if (!channel) return;

  if (ws) {
    ws.close();
  }

  ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.onerror = () => {
    console.info("you failed to connect to the web socket.");
    cancel(true);
  }

  ws.onopen = () => {
    console.log('Connected to Twitch IRC');
    // Anonymous login
    ws.send('PASS none');
    ws.send('NICK justinfan12345');
    ws.send('CAP REQ :twitch.tv/commands');
    ws.send('CAP REQ :twitch.tv/tags');
    ws.send(`JOIN #${channel}`);
  };

  ws.onmessage = (event) => {
    const message = event.data;
    console.log(message);
    // there's a new line at the end so i did it this way. go ahead, sue me! go ahead...
    if (message.indexOf('PING :tmi.twitch.tv') > -1) {
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
      const text = parsedMessage.trailing.toLowerCase().trim();
      console.log(text);
      // test to
      if (/!play/.test(text)) {
        const username = parsedMessage.prefix.split('!')[0];
        // start game for user 
        startGame(username);
      } else if (text.startsWith('!random')) {
        setColorChoice('random');
      } else if (text.startsWith('!switch')) {
        setColorChoice('switch');
      } else if (text.startsWith('!stay')) {
        setColorChoice('stay');
      } else if (text.startsWith('!votes')) {
        // split, if number isn't second part reject
        // if number isn't less than 10 or greater than 0 reject
        // set votes
        const voteThreshold = parseInt(text.split(' ')[1].trim());
        if(!isNaN(voteThreshold) && voteThreshold < 10 && voteThreshold > 0) {
          // hack, no i do not care, react can't tell me how to use forms in the dom, go to hell.
          document.querySelector(`form input[name='votes']`).value = voteThreshold;
        }
      } else if (text.startsWith('!minutes')) {
        const mins = parseInt(text.split(' ')[1].trim());
        if(!isNaN(mins) && mins < 16 && mins > 4) {
          // hack, no i do not care, react can't tell me how to use forms in the dom, go to hell.
          document.querySelector(`form input[name='turnMin']`).value = mins;
        }
      } else if (text.startsWith('!refresh')) {
        window.location.reload();
      } else {
        console.log("no command executed.");
      }
    }
  };

  return ws;
};

const letChatStartGame = (startGame, cancel, channel, setColorChoice) => {
  const intervalId = setInterval(() => {
    console.log('interval firing');
    internalLetChatStartGame(startGame, cancel, channel, setColorChoice);
  }, 600000);
  const socket = internalLetChatStartGame(startGame, cancel, channel, setColorChoice);
  return [intervalId, socket];
};

export default letChatStartGame;
