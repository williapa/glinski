import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  ArrowRight,
  Bot,
  Hexagon,
  Play,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import SoloGameLayout from '../game/SoloGameLayout';
import { DisableClicksProvider } from '../hooks/useDisableClicks';
import QueenBee from '../img/queen-bee.png';
import './SplashV2.css';

const MIN_CHANNEL_LENGTH = 4;

const normalizeChannel = (value) => (
  value.trim().replace(/^@+/, '').toLowerCase()
);

const featureCards = [
  {
    icon: Hexagon,
    title: 'Hex board tactics',
    copy: 'A 91-cell variant where familiar pieces create unfamiliar pressure lines.',
  },
  {
    icon: Bot,
    title: 'Solo against AI',
    copy: 'Start fast in browser and play a complete game without a Twitch setup.',
  },
  {
    icon: Users,
    title: 'Chat-powered moves',
    copy: 'Connect to a channel so viewers can vote through Twitch chat commands.',
  },
];

const SplashV2 = () => {
  const navigate = useNavigate();
  const [playSolo, setPlaySolo] = useState(false);
  const [channel, setChannel] = useState('');

  const normalizedChannel = useMemo(() => normalizeChannel(channel), [channel]);
  const canPlayWithChat = normalizedChannel.length >= MIN_CHANNEL_LENGTH;

  useEffect(() => {
    document.body.classList.add('splash-v2-body');
    return () => document.body.classList.remove('splash-v2-body');
  }, []);

  const goToChannel = (event) => {
    event.preventDefault();
    if (!canPlayWithChat) return;
    navigate(`/${normalizedChannel}`);
  };

  if (playSolo) {
    return (
      <DisableClicksProvider>
        <SoloGameLayout />
      </DisableClicksProvider>
    );
  }

  return (
    <main className="splash-v2">
      <section className="splash-v2-hero">
        <Container size="xl" className="splash-v2-hero-inner">
          <div className="splash-v2-copy">
            <Group gap="sm" className="splash-v2-brand">
              <img src={QueenBee} alt="Glinski bee logo" />
              <span>Glinski</span>
            </Group>

            <Badge
              className="splash-v2-badge"
              leftSection={<Sparkles size={14} />}
              variant="light"
            >
              Hexagonal chess for browser play
            </Badge>

            <Title order={1} className="splash-v2-title">
              Play hexagonal chess with an AI or your Twitch chat.
            </Title>

            <Text className="splash-v2-subtitle">
              Glinski brings the classic chess objective onto a 91-cell hex board,
              with a solo mode for quick games and a chat voting mode for streams.
            </Text>

            <Group className="splash-v2-actions" align="stretch">
              <Button
                size="lg"
                radius="md"
                leftSection={<Play size={20} />}
                onClick={() => setPlaySolo(true)}
                className="splash-v2-primary"
              >
                Play vs AI
              </Button>

              <form className="splash-v2-channel-form" onSubmit={goToChannel}>
                <TextInput
                  classNames={{
                    root: 'splash-v2-channel-root',
                    input: 'splash-v2-channel-input',
                  }}
                  aria-label="Twitch channel"
                  placeholder="twitch channel"
                  value={channel}
                  leftSection={<Radio size={18} />}
                  onChange={(event) => setChannel(event.currentTarget.value)}
                />
                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  variant="white"
                  color="dark"
                  rightSection={<ArrowRight size={19} />}
                  disabled={!canPlayWithChat}
                  className="splash-v2-twitch-button"
                >
                  Play with chat
                </Button>
              </form>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" className="splash-v2-mode-grid">
              <div className="splash-v2-mode">
                <ThemeIcon radius="md" size="lg" variant="light" color="yellow">
                  <Bot size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700}>Solo mode</Text>
                  <Text size="sm">Pick a side and challenge the browser AI.</Text>
                </div>
              </div>
              <div className="splash-v2-mode">
                <ThemeIcon radius="md" size="lg" variant="light" color="violet">
                  <Radio size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={700}>Twitch mode</Text>
                  <Text size="sm">Enter a channel, broadcast the board, and let chat vote.</Text>
                </div>
              </div>
            </SimpleGrid>
          </div>

          <div className="splash-v2-showcase" aria-label="Glinski gameplay preview">
            <div className="splash-v2-media-frame">
              <div className="splash-v2-media-placeholder" />
            </div>
          </div>
        </Container>
      </section>

      <section className="splash-v2-info">
        <Container size="xl">
          <div className="splash-v2-info-heading">
            <Text className="splash-v2-kicker">What is this?</Text>
            <Title order={2}>Hexagonal chess, designed for twitch.</Title>
          </div>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {featureCards.map(({ icon: Icon, title, copy }) => (
              <div className="splash-v2-feature" key={title}>
                <ThemeIcon radius="md" size="xl" variant="light" color="yellow">
                  <Icon size={24} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text fw={800}>{title}</Text>
                  <Text size="sm">{copy}</Text>
                </Stack>
              </div>
            ))}
          </SimpleGrid>
        </Container>
      </section>
    </main>
  );
};

export default SplashV2;
