const TWITCH_BADGE_URL = 'https://cdn.simpleicons.org/twitch/9146FF';

const TwitchSeparator = () => (
  <span className="twitch-separator" aria-hidden="true">
    <img src={TWITCH_BADGE_URL} alt="" />
  </span>
);

export default TwitchSeparator;
