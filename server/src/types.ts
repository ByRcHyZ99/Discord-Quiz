export type GamePhase =
    | 'lobby'
    | 'board'
    | 'question'
    | 'submissions'
    | 'answer'
    | 'finished';

export type Player = {
  id: string;
  socketId: string;
  name: string;
  score: number;
  isHost: boolean;
  isConnected: boolean;
};

export type AbilityKey = 'P' | 'Q' | 'W' | 'E' | 'R';

export type AbilitySlot = {
  key: AbilityKey;
  imageUrl: string;
  abilityName?: string;
  isFake?: boolean;
  fakeFromChampion?: string;
};

export type Question = {
  id: string;
  categoryId: string;
  points: number;
  text: string;
  answer: string;
  used: boolean;

  questionType?: 'normal' | 'estimate' | 'ability-fake';

  soundUrl?: string;

  imageUrl?: string;
  imageMode?: 'normal' | 'zoom';
  zoomLevels?: number[];
  zoomStartIndex?: number;

  champName?: string;
  splashUrl?: string;
  abilitySlots?: AbilitySlot[];
  fakeAbilityKey?: AbilityKey;
  fakeAbilityFrom?: string;
  fakeAbilityName?: string;
};

export type AudioStatus = 'stopped' | 'playing' | 'paused';

export type AudioState = {
  soundUrl: string | null;
  status: AudioStatus;
  version: number;
  volume: number;
};

export type EstimateAnswer = {
  playerId: string;
  playerName: string;
  value: string;
  submittedAt: number;
};

export type Category = {
  id: string;
  title: string;
  questions: Question[];
};

export type Buzz = {
  playerId: string;
  playerName: string;
  timestamp: number;
};

export type ActiveQuestion = {
  question: Question;
  revealed: boolean;
  zoomStep: number;
  estimateAnswers: EstimateAnswer[];
  estimateAwardedPlayerId?: string | null;
  estimateAwardedPlayerName?: string | null;

  abilityBlurred?: boolean;
  abilityView?: 'question' | 'solution';
};

export type BuzzerState = {
  locked: boolean;
  firstBuzz: Buzz | null;
  buzzOrder: Buzz[];
};

export type Room = {
  roomCode: string;
  phase: GamePhase;
  hostId: string;
  players: Player[];
  categories: Category[];
  activeQuestion: ActiveQuestion | null;
  buzzer: BuzzerState;
  message: string;
  audio: AudioState;
};

export type PublicPlayer = Omit<Player, 'socketId'>;

export type PublicRoom = Omit<Room, 'players'> & {
  players: PublicPlayer[];
  audio: AudioState;
};

export type ServerResponse = {
  ok: boolean;
  error?: string;
  playerId?: string;
  roomCode?: string;
  state?: PublicRoom;
};
