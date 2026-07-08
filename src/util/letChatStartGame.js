import parseIrcMessage from './parsedIrcMessage';
import playVideo from '../audio/playVideo';
import textToVote from './textToVote';

const COMMANDS_ACK  = 'CAP * ACK :twitch.tv/commands';
const TAGS_ACK = 'CAP * ACK :twitch.tv/tags';
const CHANNEL_SUCCESS = (channel) => (`:justinfan12345!justinfan12345@justinfan12345.tmi.twitch.tv JOIN #${channel.toLowerCase()}`);

const sg = (parsedMessage, startGame, text) => {
  let username = parsedMessage.prefix.split('!')[0];
  if (username === 'keyvalue') {
    username = '𝗧𝘆𝗹𝗲𝗿𝗝𝘂𝗮𝗻';
  }
  // start game for user 
  startGame(username);
}

let ws = null;
// use web socket to connect to the twitch channel IRC chat
const internalLetChatStartGame = (startGame, cancel, channel, setColorChoice, onUpdateVoteThreshold) => {

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
      const username = parsedMessage.prefix.split('!')[0];
      console.log(text);
      // test to
      if(/!g/.test(text)) {
        document.getElementById("aiMove").checked = true;
        document.querySelector(`form input[name='votes']`).value = 0;
        document.querySelector(`form input[name='turnMin']`).value = 2;
        if (onUpdateVoteThreshold) {
          onUpdateVoteThreshold(0);
        }
        sg(parsedMessage, startGame, text);
      } else if (/!play/.test(text)) {
        sg(parsedMessage, startGame, text);
      } else if (text.startsWith('!black')) {
        setColorChoice('black');
      } else if (text.startsWith('!white')) {
        setColorChoice('white');
      } else if (text.startsWith('!votes')) {
        textToVote(text, onUpdateVoteThreshold);
      } else if (text.startsWith('!minutes')) {
        const mins = parseInt(text.split(' ')[1].trim());
        if(!isNaN(mins) && mins < 61 && mins > 0) {
          // hack?! no sir, i do not care, in fact react will ever tell me how to use forms in the dom, go to hell.
          document.querySelector(`form input[name='turnMin']`).value = mins;
        }
      } else if (text.startsWith('!refresh') && username === channel) {
        window.location.reload();
      } /* else if (['!chickens', '!dowork', '!22s', '!dirtygirl', '!timetravel'].includes(text)) {
        console.log("hello!");
        playVideo(text.substring(1));
      } */ else {
        console.log("no command executed.");
      }
    }
  };

  return ws;
};

const letChatStartGame = (startGame, cancel, channel, setColorChoice, onUpdateVoteThreshold) => {
  const intervalId = setInterval(() => {
    console.log('interval firing');
    internalLetChatStartGame(startGame, cancel, channel, setColorChoice, onUpdateVoteThreshold);
  }, 600000);
  const socket = internalLetChatStartGame(startGame, cancel, channel, setColorChoice, onUpdateVoteThreshold);
  return [intervalId, socket];
};

export default letChatStartGame;
