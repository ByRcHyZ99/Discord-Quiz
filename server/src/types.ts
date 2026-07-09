export type GamePhase =
    | 'lobby'
    | 'soundcheck'
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
  jokerShieldAvailable: boolean;
  jokerBlockAvailable: boolean;
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

  questionType?: 'normal' | 'estimate' | 'ability-fake' | 'progressive';

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
  progressiveClues?: string[];
};

export type AudioStatus = 'stopped' | 'playing' | 'paused';

export type AudioState = {
  soundUrl: string | null;
  status: AudioStatus;
  version: number;
  volume: number;
};

export type QuizBoard = {
  id: string;
  title: string;
  categories: Category[];
};

export type BoardSummary = {
  index: number;
  id: string;
  title: string;
  usedCount: number;
  totalCount: number;
};

export type EstimateAnswer = {
  playerId: string;
  playerName: string;
  value: string;
  submittedAt: number;
};

export type BuzzerBlockEntry = {
  sourcePlayerId: string;
  sourcePlayerName: string;
  targetPlayerId: string;
  targetPlayerName: string;
};

export type ActiveQuestion = {
  question: Question;
  revealed: boolean;
  zoomStep: number;
  estimateAnswers: EstimateAnswer[];

  estimateAwardedPlayerIds?: string[];
  estimateAwardedPlayerNames?: string[];

  pointAwardedPlayerIds?: string[];
  pointAwardedPlayerNames?: string[];

  abilityBlurred?: boolean;
  abilityView?: 'question' | 'solution';

  buzzTimeouts: Record<string, number>;

  progressiveRevealCount?: number;

  pointPenalizedPlayerIds?: string[];
  pointPenalizedPlayerNames?: string[];

  effectivePoints: number;
  pointsMultiplier: number;

  penaltyShieldPlayerIds?: string[];
  penaltyShieldPlayerNames?: string[];

  buzzerBlockedPlayerIds?: string[];
  buzzerBlockedPlayerNames?: string[];
  buzzerBlockEntries?: BuzzerBlockEntry[];
};

export type Category = {
  id: string;
  title: string;
  questions: Question[];
};

export type SfxState = {
  soundUrl: string | null;
  version: number;
  volume: number;
};

export type Buzz = {
  playerId: string;
  playerName: string;
  timestamp: number;
};

export type BuzzerState = {
  locked: boolean;
  firstBuzz: Buzz | null;
  buzzOrder: Buzz[];
};

export type SoundCheckBuzz = {
  playerId: string;
  playerName: string;
  timestamp: number;
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
  sfx: SfxState;
  soundCheckBuzzes: SoundCheckBuzz[];
  serverTime: number;
  categoryBoards: QuizBoard[];
  boards: BoardSummary[];
  activeBoardIndex: number;
  activeBoardDoublePointsActive: boolean;
};

export type PublicPlayer = Omit<Player, 'socketId'>;

export type PublicRoom = Omit<Room, 'players'> & {
  players: PublicPlayer[];
  audio: AudioState;
  sfx: SfxState;
  serverTime: number;
};

export type ServerResponse = {
  ok: boolean;
  error?: string;
  playerId?: string;
  roomCode?: string;
  state?: PublicRoom;
};
