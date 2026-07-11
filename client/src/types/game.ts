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
  name: string;
  score: number;
  isHost: boolean;
  isConnected: boolean;
  jokerShieldAvailable: boolean;
  jokerBlockAvailable: boolean;
};

export type BuzzerBlockEntry = {
  sourcePlayerId: string;
  sourcePlayerName: string;
  targetPlayerId: string;
  targetPlayerName: string;
};

export type AbilityKey = 'P' | 'Q' | 'W' | 'E' | 'R';

export type AbilitySlot = {
  key: AbilityKey;
  imageUrl: string;
  abilityName?: string;
  isFake?: boolean;
  fakeFromChampion?: string;
};

export type SoundCheckBuzz = {
  playerId: string;
  playerName: string;
  timestamp: number;
};

export type Question = {
  id: string;
  categoryId: string;
  points: number;
  text: string;
  answer: string;
  used: boolean;

  questionType?: 'normal' | 'estimate' | 'ability-fake' | 'progressive' | 'meme-reveal' | 'logo-fusion';

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
  memeImages?: string[];
  progressiveImageUrl?: string;

  fusionImageUrl?: string;

  logoFusionLeftName?: string;
  logoFusionLeftImageUrl?: string;

  logoFusionRightName?: string;
  logoFusionRightImageUrl?: string;
};

export type AudioStatus = 'stopped' | 'playing' | 'paused';

export type AudioState = {
  soundUrl: string | null;
  status: AudioStatus;
  version: number;
  volume: number;
};

export type SfxState = {
  soundUrl: string | null;
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

export type BoardSummary = {
  index: number;
  id: string;
  title: string;
  usedCount: number;
  totalCount: number;
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

  estimateAwardedPlayerIds?: string[];
  estimateAwardedPlayerNames?: string[];

  abilityBlurred?: boolean;
  abilityView?: 'question' | 'solution';
  buzzTimeouts: Record<string, number>;
  progressiveRevealCount?: number;

  pointAwardedPlayerIds?: string[];
  pointAwardedPlayerNames?: string[];

  pointPenalizedPlayerIds?: string[];
  pointPenalizedPlayerNames?: string[];

  effectivePoints: number;
  pointsMultiplier: number;

  penaltyShieldPlayerIds?: string[];
  penaltyShieldPlayerNames?: string[];

  buzzerBlockedPlayerIds?: string[];
  buzzerBlockedPlayerNames?: string[];
  buzzerBlockEntries?: BuzzerBlockEntry[];
  memeRevealCount?: number;
  progressiveImageRevealed?: boolean;
};

export type BuzzerState = {
  locked: boolean;
  firstBuzz: Buzz | null;
  buzzOrder: Buzz[];
};

export type GameState = {
  roomCode: string;
  phase: GamePhase;
  players: Player[];
  categories: Category[];
  activeQuestion: ActiveQuestion | null;
  buzzer: BuzzerState;
  message: string;
  audio: AudioState;
  sfx: SfxState;
  soundCheckBuzzes: SoundCheckBuzz[];
  serverTime: number;
  boards: BoardSummary[];
  activeBoardIndex: number;
  activeBoardDoublePointsActive: boolean;
};

export type ServerResponse = {
  ok: boolean;
  error?: string;
  playerId?: string;
  roomCode?: string;
  state?: GameState;
};
