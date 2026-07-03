export type GamePhase = 'start' | 'lobby' | 'board' | 'question' | 'answer' | 'finished';

export type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  isConnected: boolean;
};

export type Question = {
  id: string;
  categoryId: string;
  points: number;
  text: string;
  answer: string;
  used: boolean;
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
};

export type ServerResponse = {
  ok: boolean;
  error?: string;
  playerId?: string;
  roomCode?: string;
  state?: GameState;
};
