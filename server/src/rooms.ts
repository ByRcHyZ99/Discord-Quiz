import { randomUUID } from 'node:crypto';
import { createQuestionSet } from './data/questions.js';
import type { Player, PublicRoom, Question, Room } from './types.js';

const rooms = new Map<string, Room>();

export function createRoom(socketId: string, hostName: string): { room: Room; player: Player } {
  const roomCode = createRoomCode();
  const player = createPlayer(socketId, hostName, true);

  const room: Room = {
    roomCode,
    phase: 'lobby',
    hostId: player.id,
    players: [player],
    categories: createQuestionSet(),
    activeQuestion: null,
    audio: {
      soundUrl: null,
      status: 'stopped',
      version: 0,
      volume: 0.35
    },
    sfx: {
      soundUrl: null,
      version: 0,
      volume: 0.55
    },
    buzzer: {
      locked: true,
      firstBuzz: null,
      buzzOrder: []
    },
    soundCheckBuzzes: [],
    message: 'Room created.'
  };

  rooms.set(roomCode, room);
  return { room, player };
}

export function joinRoom(roomCode: string, socketId: string, playerName: string): { room: Room; player: Player } | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  const player = createPlayer(socketId, playerName, false);
  room.players.push(player);
  room.message = `${playerName} joined the lobby.`;

  return { room, player };
}

export function restorePlayerSession(
    roomCode: string,
    playerId: string,
    socketId: string
): { room: Room; player: Player } | null {
  const room = getRoom(roomCode);
  if (!room) return null;

  const player = room.players.find((item) => item.id === playerId);
  if (!player) return null;

  player.socketId = socketId;
  player.isConnected = true;
  room.message = `${player.name} reconnected.`;

  return { room, player };
}

export function getRoom(roomCode: string): Room | null {
  return rooms.get(roomCode.toUpperCase()) ?? null;
}

export function getPublicRoom(room: Room): PublicRoom {
  const shouldShowEstimateAnswers =
      room.phase === 'submissions' || room.phase === 'answer';

  const activeQuestion = room.activeQuestion
      ? {
        ...room.activeQuestion,
        estimateAnswers: shouldShowEstimateAnswers
            ? room.activeQuestion.estimateAnswers
            : []
      }
      : null;

  return {
    ...room,
    activeQuestion,
    players: room.players.map(({ socketId: _socketId, ...player }) => player)
  };
}

export function isHost(room: Room, socketId: string): boolean {
  return room.players.some((player) => player.socketId === socketId && player.isHost);
}

export function findQuestion(room: Room, questionId: string): Question | null {
  for (const category of room.categories) {
    const question = category.questions.find((item) => item.id === questionId);
    if (question) return question;
  }

  return null;
}

export function findRoomBySocket(socketId: string): Room | null {
  for (const room of rooms.values()) {
    if (room.players.some((player) => player.socketId === socketId)) {
      return room;
    }
  }

  return null;
}

export function markPlayerDisconnected(socketId: string): Room | null {
  const room = findRoomBySocket(socketId);
  if (!room) return null;

  const player = room.players.find((item) => item.socketId === socketId);
  if (player) {
    player.isConnected = false;
    room.message = `${player.name} disconnected.`;
  }

  return room;
}

function createPlayer(socketId: string, name: string, isHostPlayer: boolean): Player {
  return {
    id: randomUUID(),
    socketId,
    name,
    score: 0,
    isHost: isHostPlayer,
    isConnected: true
  };
}

function createRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  for (let attempts = 0; attempts < 20; attempts += 1) {
    const code = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    if (!rooms.has(code)) return code;
  }

  return randomUUID().slice(0, 6).toUpperCase();
}
