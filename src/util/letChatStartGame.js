import parseIrcMessage from './parsedIrcMessage';

const COMMANDS_ACK  = 'CAP * ACK :twitch.tv/commands';
const TAGS_ACK = 'CAP * ACK :twitch.tv/tags';
const CHANNEL_SUCCESS = (channel) => (`:justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #${channel.toLowerCase()}`);

let ws = null;

// use web socket to connect to the twitch channel IRC chat
// add moves from chat to the log 
// disconnect when there's no time left
const letChatStartGame = (startGame, cancel, channel) => {

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
      const text = parsedMessage.trailing.toUpperCase().trim();
      // test to
      if (/!play/.test(text)) {
        const username = parsedMessage.prefix.split('!')[0];
        // start game for user 
        startGame(username);
      }
    }
  };

  return ws;
};

export default letChatStartGame;
