import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import {
  createRoom,
  findQuestion,
  getPublicRoom,
  getRoom,
  isHost,
  joinRoom,
  markPlayerDisconnected,
  restorePlayerSession
} from './rooms.js';
import type { Room, ServerResponse, ActiveQuestion} from './types.js';

const PORT = Number(process.env.PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(
    cors({
      origin: CLIENT_URL,
      methods: ["GET", "POST"]
    })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    version: "answer-screen-fix-v1"
  });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

function playRoomSfx(room: Room, soundUrl: string) {
  const currentSfx = room.sfx ?? {
    soundUrl: null,
    version: 0,
    volume: 0.55
  };

  room.sfx = {
    soundUrl,
    version: currentSfx.version + 1,
    volume: currentSfx.volume
  };
}

function getActiveBoardQuestions(room: Room) {
  const activeBoard = room.categoryBoards[room.activeBoardIndex];

  if (!activeBoard) return [];

  return activeBoard.categories.flatMap((category) => category.questions);
}

function isDoublePointsActive(room: Room) {
  const questions = getActiveBoardQuestions(room);
  const unusedCount = questions.filter((question) => !question.used).length;

  return unusedCount <= 5;
}

function getActiveQuestionPoints(activeQuestion: ActiveQuestion) {
  return activeQuestion.effectivePoints ?? activeQuestion.question.points;
}

function mapPlayerNames(room: Room, playerIds: string[]) {
  return playerIds
      .map((playerId: string) => room.players.find((player) => player.id === playerId)?.name)
      .filter((name: string | undefined): name is string => Boolean(name));
}

function markActiveQuestionUsed(room: Room) {
  const activeQuestion = room.activeQuestion?.question;
  if (!activeQuestion) return;

  activeQuestion.used = true;

  for (const category of room.categories) {
    const matchingQuestion = category.questions.find(
        (question) => question.id === activeQuestion.id
    );

    if (matchingQuestion) {
      matchingQuestion.used = true;
    }
  }
}

function clampVolume(volume: number) {
  return Math.max(0, Math.min(1, volume));
}

function setRoomAudio(
    room: Room,
    status: 'stopped' | 'playing' | 'paused',
    soundUrl?: string | null
) {
  const currentAudio = room.audio ?? {
    soundUrl: null,
    status: 'stopped',
    version: 0,
    volume: 0.35
  };

  room.audio = {
    soundUrl: soundUrl !== undefined ? soundUrl : currentAudio.soundUrl,
    status,
    version: currentAudio.version + 1,
    volume: currentAudio.volume
  };
}

function setRoomAudioVolume(room: Room, volume: number) {
  const currentAudio = room.audio ?? {
    soundUrl: null,
    status: 'stopped',
    version: 0,
    volume: 0.35
  };

  room.audio = {
    ...currentAudio,
    volume: clampVolume(volume)
  };
}

io.on('connection', (socket) => {
  socket.on('room:create', (payload: { hostName: string }, callback: (response: ServerResponse) => void) => {
    const hostName = cleanName(payload.hostName, 'Host');
    const { room, player } = createRoom(socket.id, hostName);
    socket.join(room.roomCode);

    respond(callback, room, player.id);
    emitRoom(room);
  });

  socket.on(
      'patch:submit',
      (
          payload: { roomCode: string; playerId: string; choiceKey: 'A' | 'B' | 'C' | 'D' },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'patch-quatsch'
        ) {
          callback({ ok: false, error: 'No Patch oder Quatsch question is active.' });
          return;
        }

        if (room.phase !== 'question') {
          callback({ ok: false, error: 'Answers are closed.' });
          return;
        }

        if (!activeQuestion.revealed) {
          callback({ ok: false, error: 'Question is not revealed yet.' });
          return;
        }

        const player = room.players.find((item) => item.id === payload.playerId);

        if (!player) {
          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        player.socketId = socket.id;
        player.isConnected = true;

        const choices = activeQuestion.question.patchChoices ?? [];
        const selectedChoice = choices.find((choice) => choice.key === payload.choiceKey);

        if (!selectedChoice) {
          callback({ ok: false, error: 'Invalid answer choice.' });
          return;
        }

        const existingAnswer = activeQuestion.patchAnswers.find(
            (answer: { playerId: string }) => answer.playerId === player.id
        );

        if (existingAnswer) {
          existingAnswer.choiceKey = payload.choiceKey;
          existingAnswer.submittedAt = Date.now();
        } else {
          activeQuestion.patchAnswers.push({
            playerId: player.id,
            playerName: player.name,
            choiceKey: payload.choiceKey,
            submittedAt: Date.now()
          });
        }

        room.message = `${player.name} locked in answer ${payload.choiceKey}.`;

        respond(callback, room, player.id);
        emitRoom(room);
      }
  );

  socket.on(
      'patch:close',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'patch-quatsch'
        ) {
          callback({ ok: false, error: 'No Patch oder Quatsch question is active.' });
          return;
        }

        room.phase = 'submissions';
        room.buzzer.locked = true;
        room.buzzer.firstBuzz = null;
        room.buzzer.buzzOrder = [];

        room.message = 'Patch oder Quatsch answers are locked.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'patch:reveal-answer',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'patch-quatsch'
        ) {
          callback({ ok: false, error: 'No Patch oder Quatsch question is active.' });
          return;
        }

        markActiveQuestionUsed(room);

        room.phase = 'answer';
        room.buzzer.locked = true;
        room.buzzer.firstBuzz = null;
        room.buzzer.buzzOrder = [];

        room.message = 'Correct fake fact revealed. Award points manually.';

        playRoomSfx(room, '/sounds/sfx/correct.mp3');

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'meme:reveal-next',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'meme-reveal'
        ) {
          callback({ ok: false, error: 'No meme reveal question is active.' });
          return;
        }

        if (!activeQuestion.revealed) {
          callback({ ok: false, error: 'Reveal the question first.' });
          return;
        }

        const memes = activeQuestion.question.memeImages ?? [];
        const currentCount = activeQuestion.memeRevealCount ?? 0;

        activeQuestion.memeRevealCount = Math.min(
            currentCount + 1,
            memes.length
        );

        room.message = 'Next meme revealed.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'meme:hide-last',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'meme-reveal'
        ) {
          callback({ ok: false, error: 'No meme reveal question is active.' });
          return;
        }

        const currentCount = activeQuestion.memeRevealCount ?? 0;

        activeQuestion.memeRevealCount = Math.max(currentCount - 1, 0);

        room.message = 'Last meme hidden.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'meme:reset',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'meme-reveal'
        ) {
          callback({ ok: false, error: 'No meme reveal question is active.' });
          return;
        }

        activeQuestion.memeRevealCount = 0;

        room.message = 'Memes reset.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'joker:use-shield',
      (
          payload: { roomCode: string; playerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion || room.phase !== 'question' || activeQuestion.revealed) {
          callback({
            ok: false,
            error: 'Shield Joker can only be used before the question is revealed.'
          });
          return;
        }

        const player = room.players.find((item) => item.id === payload.playerId);

        if (!player) {
          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        player.socketId = socket.id;
        player.isConnected = true;

        if (!player.jokerShieldAvailable) {
          callback({ ok: false, error: 'Shield Joker already used.' });
          return;
        }

        const shieldIds = new Set(activeQuestion.penaltyShieldPlayerIds ?? []);
        shieldIds.add(player.id);

        activeQuestion.penaltyShieldPlayerIds = Array.from(shieldIds);
        activeQuestion.penaltyShieldPlayerNames = mapPlayerNames(
            room,
            activeQuestion.penaltyShieldPlayerIds
        );

        player.jokerShieldAvailable = false;

        room.message = `${player.name} used Shield Joker for this question.`;

        respond(callback, room, player.id);
        emitRoom(room);
      }
  );

  socket.on(
      'joker:use-block',
      (
          payload: { roomCode: string; playerId: string; targetPlayerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion || room.phase !== 'question' || activeQuestion.revealed) {
          callback({
            ok: false,
            error: 'Block Joker can only be used before the question is revealed.'
          });
          return;
        }

        const player = room.players.find((item) => item.id === payload.playerId);

        if (!player) {
          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        player.socketId = socket.id;
        player.isConnected = true;

        if (!player.jokerBlockAvailable) {
          callback({ ok: false, error: 'Block Joker already used.' });
          return;
        }

        const target = room.players.find((item) => item.id === payload.targetPlayerId);

        if (!target) {
          callback({ ok: false, error: 'Target player not found.' });
          return;
        }

        if (target.id === player.id) {
          callback({ ok: false, error: 'You cannot block yourself.' });
          return;
        }

        const blockedIds = new Set(activeQuestion.buzzerBlockedPlayerIds ?? []);
        blockedIds.add(target.id);

        activeQuestion.buzzerBlockedPlayerIds = Array.from(blockedIds);
        activeQuestion.buzzerBlockedPlayerNames = mapPlayerNames(
            room,
            activeQuestion.buzzerBlockedPlayerIds
        );

        activeQuestion.buzzerBlockEntries = [
          ...(activeQuestion.buzzerBlockEntries ?? []),
          {
            sourcePlayerId: player.id,
            sourcePlayerName: player.name,
            targetPlayerId: target.id,
            targetPlayerName: target.name
          }
        ];

        player.jokerBlockAvailable = false;

        room.message = `${player.name} used Block Joker. ${target.name} cannot buzz this question.`;

        respond(callback, room, player.id);
        emitRoom(room);
      }
  );

  socket.on(
      'board:switch',
      (
          payload: { roomCode: string; boardIndex: number },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (room.phase !== 'board') {
          callback({
            ok: false,
            error: 'You can only switch boards while the game board is visible.'
          });
          return;
        }

        const boardIndex = payload.boardIndex;

        if (
            !Number.isInteger(boardIndex) ||
            boardIndex < 0 ||
            boardIndex >= room.categoryBoards.length
        ) {
          callback({ ok: false, error: 'Invalid board index.' });
          return;
        }

        room.activeBoardIndex = boardIndex;
        room.categories = room.categoryBoards[boardIndex].categories;

        room.buzzer.locked = true;
        room.buzzer.firstBuzz = null;
        room.buzzer.buzzOrder = [];
        room.activeQuestion = null;

        room.boards = room.categoryBoards.map((board, index) => {
          const questions = board.categories.flatMap((category) => category.questions);

          return {
            index,
            id: board.id,
            title: board.title,
            usedCount: questions.filter((question) => question.used).length,
            totalCount: questions.length
          };
        });

        room.message = `${room.categoryBoards[boardIndex].title} opened.`;

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'points:set-penalty',
      (
          payload: { roomCode: string; playerId: string; penalized: boolean },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion) {
          callback({ ok: false, error: 'No active question.' });
          return;
        }

        if (
            room.phase !== 'question' &&
            room.phase !== 'submissions' &&
            room.phase !== 'answer'
        ) {
          callback({
            ok: false,
            error: 'Penalties can only be changed during an active question.'
          });
          return;
        }

        const player = room.players.find((item) => item.id === payload.playerId);

        if (!player) {
          callback({ ok: false, error: 'Player not found.' });
          return;
        }

        const penalty = Math.round(getActiveQuestionPoints(activeQuestion) / 2);

        const shieldIds = new Set(activeQuestion.penaltyShieldPlayerIds ?? []);
        const hasPenaltyShield = shieldIds.has(player.id);

        if (payload.penalized && hasPenaltyShield) {
          room.message = `${player.name}'s Shield Joker blocked the ${penalty} point penalty.`;

          respond(callback, room);
          emitRoom(room);
          return;
        }

        const penaltyCounts: Record<string, number> = {
          ...(activeQuestion.pointPenaltyCounts ?? {})
        };

        const currentCount = penaltyCounts[player.id] ?? 0;

        if (payload.penalized) {
          penaltyCounts[player.id] = currentCount + 1;
          player.score -= penalty;

          room.message = `${player.name} lost ${penalty} points. Penalties on this question: ${penaltyCounts[player.id]}.`;
        } else {
          if (currentCount <= 0) {
            callback({ ok: false, error: 'This player has no penalty to remove.' });
            return;
          }

          const nextCount = currentCount - 1;

          if (nextCount <= 0) {
            delete penaltyCounts[player.id];
          } else {
            penaltyCounts[player.id] = nextCount;
          }

          player.score += penalty;

          room.message = `${player.name} got ${penalty} penalty points restored. Remaining penalties on this question: ${nextCount}.`;
        }

        activeQuestion.pointPenaltyCounts = penaltyCounts;

        activeQuestion.pointPenalizedPlayerIds = Object.keys(penaltyCounts).filter(
            (playerId: string) => penaltyCounts[playerId] > 0
        );

        activeQuestion.pointPenalizedPlayerNames =
            activeQuestion.pointPenalizedPlayerIds
                .map((playerId: string) => {
                  const penalizedPlayer = room.players.find((item) => item.id === playerId);
                  if (!penalizedPlayer) return undefined;

                  const count = penaltyCounts[playerId] ?? 0;

                  return count > 1
                      ? `${penalizedPlayer.name} x${count}`
                      : penalizedPlayer.name;
                })
                .filter((name: string | undefined): name is string => Boolean(name));

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'ability:set-blur',
      (
          payload: { roomCode: string; blurred: boolean },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'ability-fake'
        ) {
          callback({ ok: false, error: 'No ability fake question is active.' });
          return;
        }

        room.activeQuestion.abilityBlurred = payload.blurred;
        room.message = payload.blurred ? 'Ability view blurred.' : 'Ability view revealed.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'points:set-award',
      (
          payload: { roomCode: string; playerId: string; awarded: boolean },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion) {
          callback({ ok: false, error: 'No active question.' });
          return;
        }

        if (
            room.phase !== 'question' &&
            room.phase !== 'submissions' &&
            room.phase !== 'answer'
        ) {
          callback({ ok: false, error: 'Points can only be awarded during an active question.' });
          return;
        }

        const player = room.players.find((item) => item.id === payload.playerId);

        if (!player) {
          callback({ ok: false, error: 'Player not found.' });
          return;
        }

        const points = getActiveQuestionPoints(activeQuestion);
        const awardedIds = new Set(activeQuestion.pointAwardedPlayerIds ?? []);
        const isAlreadyAwarded = awardedIds.has(player.id);

        if (payload.awarded && !isAlreadyAwarded) {
          awardedIds.add(player.id);
          player.score += points;
          room.message = `${player.name} received ${points} points.`;
        }

        if (!payload.awarded && isAlreadyAwarded) {
          awardedIds.delete(player.id);
          player.score -= points;
          room.message = `${player.name} lost ${points} awarded points.`;
        }

        activeQuestion.pointAwardedPlayerIds = Array.from(awardedIds);

        activeQuestion.pointAwardedPlayerNames =
            activeQuestion.pointAwardedPlayerIds
                .map((playerId: string) => room.players.find((item) => item.id === playerId)?.name)
                .filter((name: string | undefined): name is string => Boolean(name));

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'soundcheck:buzz',
      (
          payload: { roomCode: string; playerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        if (room.phase !== 'soundcheck') {
          callback({ ok: false, error: 'Soundcheck is not active.' });
          return;
        }

        const player = room.players.find(
            (item) => item.id === payload.playerId && item.socketId === socket.id
        );

        if (!player) {
          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        const existingBuzz = room.soundCheckBuzzes.find(
            (buzz) => buzz.playerId === player.id
        );

        if (!existingBuzz) {
          room.soundCheckBuzzes.push({
            playerId: player.id,
            playerName: player.name,
            timestamp: Date.now()
          });
        }

        playRoomSfx(room, '/sounds/sfx/buzzer.mp3');

        room.message = `${player.name} tested the buzzer.`;

        respond(callback, room, player.id);
        emitRoom(room);
      }
  );

  socket.on(
      'soundcheck:play-sound',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (room.phase !== 'soundcheck') {
          callback({ ok: false, error: 'Soundcheck is not active.' });
          return;
        }

        playRoomSfx(room, '/sounds/sfx/buzzer.mp3');

        room.message = 'Test sound played.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'soundcheck:reset',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (room.phase !== 'soundcheck') {
          callback({ ok: false, error: 'Soundcheck is not active.' });
          return;
        }

        room.soundCheckBuzzes = [];
        room.message = 'Soundcheck reset.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'progressive:reveal-image',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'progressive'
        ) {
          callback({ ok: false, error: 'No progressive question is active.' });
          return;
        }

        if (!activeQuestion.revealed) {
          callback({ ok: false, error: 'Reveal the question first.' });
          return;
        }

        const clues = activeQuestion.question.progressiveClues ?? [];
        const revealCount = activeQuestion.progressiveRevealCount ?? 0;

        if (revealCount < clues.length) {
          callback({
            ok: false,
            error: 'Reveal all text hints before revealing the image.'
          });
          return;
        }

        if (!activeQuestion.question.progressiveImageUrl) {
          callback({
            ok: false,
            error: 'This question has no progressive image.'
          });
          return;
        }

        activeQuestion.progressiveImageRevealed = true;

        room.message = 'Image revealed.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'soundcheck:continue',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (room.phase !== 'soundcheck') {
          callback({ ok: false, error: 'Soundcheck is not active.' });
          return;
        }

        room.phase = 'board';
        room.buzzer.locked = true;
        room.buzzer.firstBuzz = null;
        room.buzzer.buzzOrder = [];
        room.message = 'Game board opened.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'progressive:reveal-next',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'progressive'
        ) {
          callback({ ok: false, error: 'No progressive question is active.' });
          return;
        }

        if (!activeQuestion.revealed) {
          callback({ ok: false, error: 'Reveal the question first.' });
          return;
        }

        const clues = activeQuestion.question.progressiveClues ?? [];
        const currentCount = activeQuestion.progressiveRevealCount ?? 0;

        activeQuestion.progressiveRevealCount = Math.min(
            currentCount + 1,
            clues.length
        );

        room.message = 'Next description revealed.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'progressive:hide-last',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'progressive'
        ) {
          callback({ ok: false, error: 'No progressive question is active.' });
          return;
        }

        const currentCount = activeQuestion.progressiveRevealCount ?? 0;

        activeQuestion.progressiveRevealCount = Math.max(currentCount - 1, 0);
        activeQuestion.progressiveImageRevealed = false;

        room.message = 'Last description hidden.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'progressive:reset',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'progressive'
        ) {
          callback({ ok: false, error: 'No progressive question is active.' });
          return;
        }

        activeQuestion.progressiveRevealCount = 0;
        activeQuestion.progressiveImageRevealed = false;

        room.message = 'Descriptions and image reset.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'ability:set-view',
      (
          payload: { roomCode: string; view: 'question' | 'solution' },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'ability-fake'
        ) {
          callback({ ok: false, error: 'No ability fake question is active.' });
          return;
        }

        room.activeQuestion.abilityView = payload.view;

        if (payload.view === 'solution') {
          room.activeQuestion.abilityBlurred = false;
        }

        room.message =
            payload.view === 'solution'
                ? 'Solution view shown.'
                : 'Question view shown.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'estimate:submit',
      (
          payload: { roomCode: string; playerId?: string; value: string },
          callback: (response: ServerResponse) => void
      ) => {
        if (!payload || typeof payload.roomCode !== 'string') {
          callback({ ok: false, error: 'Missing room code.' });
          return;
        }
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'estimate'
        ) {
          callback({ ok: false, error: 'No estimate question is active.' });
          return;
        }

        if (room.phase !== 'question') {
          callback({ ok: false, error: 'Estimate submissions are closed.' });
          return;
        }

        if (!activeQuestion.revealed) {
          callback({ ok: false, error: 'Question is not revealed yet.' });
          return;
        }

        const value = payload.value.trim();

        if (!value) {
          callback({ ok: false, error: 'Answer cannot be empty.' });
          return;
        }

        const payloadPlayerId =
            typeof payload.playerId === 'string'
                ? payload.playerId
                : '';

        let player = room.players.find(
            (item) => item.socketId === socket.id
        );

        if (!player && payloadPlayerId) {
          player = room.players.find(
              (item) => item.id === payloadPlayerId
          );
        }

        if (!player) {
          console.warn('Estimate submit failed: player not found', {
            roomCode: room.roomCode,
            payloadPlayerId,
            socketId: socket.id,
            players: room.players.map((item) => ({
              id: item.id,
              name: item.name,
              socketId: item.socketId,
              isConnected: item.isConnected
            }))
          });

          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        player.socketId = socket.id;
        player.isConnected = true;
        socket.join(room.roomCode);

        activeQuestion.estimateAnswers = activeQuestion.estimateAnswers ?? [];

        const existingAnswer = activeQuestion.estimateAnswers.find(
            (answer: { playerId: string }) => answer.playerId === player.id
        );

        if (existingAnswer) {
          existingAnswer.value = value;
          existingAnswer.submittedAt = Date.now();
        } else {
          activeQuestion.estimateAnswers.push({
            playerId: player.id,
            playerName: player.name,
            value,
            submittedAt: Date.now()
          });
        }

        room.message = `${player.name} submitted an estimate.`;

        respond(callback, room, player.id);
        emitRoom(room);
      }
  );

  socket.on(
      'estimate:award',
      (
          payload: { roomCode: string; playerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (
            !activeQuestion ||
            activeQuestion.question.questionType !== 'estimate'
        ) {
          callback({ ok: false, error: 'No estimate question is active.' });
          return;
        }

        if (room.phase !== 'submissions' && room.phase !== 'answer') {
          callback({
            ok: false,
            error: 'You can only award estimate points after closing submissions.'
          });
          return;
        }

        const winner = room.players.find((player) => player.id === payload.playerId);

        if (!winner) {
          callback({ ok: false, error: 'Player not found.' });
          return;
        }

        const hasSubmitted = activeQuestion.estimateAnswers.some(
            (answer: { playerId: string }) => answer.playerId === winner.id
        );

        if (!hasSubmitted) {
          callback({
            ok: false,
            error: 'This player did not submit an estimate.'
          });
          return;
        }

        const points = activeQuestion.question.points;

        const awardedIds = new Set(activeQuestion.estimateAwardedPlayerIds ?? []);

        if (awardedIds.has(winner.id)) {
          awardedIds.delete(winner.id);
          winner.score -= points;
          room.message = `${winner.name} lost ${points} estimate points.`;
        } else {
          awardedIds.add(winner.id);
          winner.score += points;
          room.message = `${winner.name} received ${points} estimate points.`;
        }

        activeQuestion.estimateAwardedPlayerIds = Array.from(awardedIds);

        activeQuestion.estimateAwardedPlayerNames =
            activeQuestion.estimateAwardedPlayerIds
                .map((playerId: string) => room.players.find((player) => player.id === playerId)?.name)
                .filter((name: string | undefined): name is string => Boolean(name));

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'estimate:close',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'estimate'
        ) {
          callback({ ok: false, error: 'No estimate question is active.' });
          return;
        }

        room.phase = 'submissions';
        room.buzzer.locked = true;
        room.message = 'All player answers are now visible.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'room:leave',
      (
          payload: { roomCode: string; playerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: true });
          return;
        }

        const playerIndex = room.players.findIndex(
            (player) =>
                player.id === payload.playerId ||
                player.socketId === socket.id
        );

        if (playerIndex === -1) {
          callback({ ok: true });
          return;
        }

        const leavingPlayer = room.players[playerIndex];

        room.players.splice(playerIndex, 1);

        socket.leave(room.roomCode);

        if (room.players.length === 0) {
          callback({ ok: true });
          return;
        }

        if (leavingPlayer.isHost) {
          const newHost = room.players[0];

          room.hostId = newHost.id;
          newHost.isHost = true;

          for (const player of room.players) {
            if (player.id !== newHost.id) {
              player.isHost = false;
            }
          }

          room.message = `${leavingPlayer.name} left the game. ${newHost.name} is now host.`;
        } else {
          room.message = `${leavingPlayer.name} left the game.`;
        }

        callback({ ok: true });

        emitRoom(room);
      }
  );

  socket.on(
      'estimate:reveal-answer',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'estimate'
        ) {
          callback({ ok: false, error: 'No estimate question is active.' });
          return;
        }

        room.phase = 'answer';
        room.buzzer.locked = true;
        room.message = 'Correct answer revealed.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'image:reveal-more',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion || activeQuestion.question.imageMode !== 'zoom') {
          callback({ ok: false, error: 'This question has no zoom image.' });
          return;
        }

        const maxStep = (activeQuestion.question.zoomLevels?.length ?? 1) - 1;
        activeQuestion.zoomStep = Math.min(activeQuestion.zoomStep + 1, maxStep);

        room.message = 'Image revealed more.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'image:reveal-less',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion || activeQuestion.question.imageMode !== 'zoom') {
          callback({ ok: false, error: 'This question has no zoom image.' });
          return;
        }

        activeQuestion.zoomStep = Math.max(activeQuestion.zoomStep - 1, 0);

        room.message = 'Image zoomed in again.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'image:reset',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;

        if (!activeQuestion || activeQuestion.question.imageMode !== 'zoom') {
          callback({ ok: false, error: 'This question has no zoom image.' });
          return;
        }

        activeQuestion.zoomStep = activeQuestion.question.zoomStartIndex ?? 0;

        room.message = 'Image zoom reset.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'audio:play',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const soundUrl = room.activeQuestion?.question.soundUrl;

        if (!soundUrl) {
          callback({ ok: false, error: 'This question has no sound.' });
          return;
        }

        setRoomAudio(room, 'playing', soundUrl);
        room.message = 'Sound playing.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'audio:volume',
      (
          payload: { roomCode: string; volume: number },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        setRoomAudioVolume(room, payload.volume);
        room.message = `Sound volume set to ${Math.round(room.audio.volume * 100)}%.`;

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'audio:pause',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        setRoomAudio(room, 'paused');
        room.message = 'Sound paused.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'audio:stop',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        setRoomAudio(room, 'stopped');
        room.message = 'Sound stopped.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'audio:restart',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const soundUrl = room.activeQuestion?.question.soundUrl;

        if (!soundUrl) {
          callback({ ok: false, error: 'This question has no sound.' });
          return;
        }

        setRoomAudio(room, 'playing', soundUrl);
        room.message = 'Sound restarted.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
    'room:join',
    (payload: { roomCode: string; playerName: string }, callback: (response: ServerResponse) => void) => {
      const roomCode = cleanRoomCode(payload.roomCode);
      const playerName = cleanName(payload.playerName, 'Player');
      const result = joinRoom(roomCode, socket.id, playerName);

      if (!result) {
        callback({ ok: false, error: 'Room not found.' });
        return;
      }

      socket.join(result.room.roomCode);
      respond(callback, result.room, result.player.id);
      emitRoom(result.room);
    }
  );

  socket.on(
      'room:restore',
      (
          payload: { roomCode: string; playerId: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const playerId = payload.playerId;

        const result = restorePlayerSession(roomCode, playerId, socket.id);

        if (!result) {
          callback({ ok: false, error: 'Previous session could not be restored.' });
          return;
        }

        socket.join(result.room.roomCode);

        respond(callback, result.room, result.player.id);
        emitRoom(result.room);
      }
  );

  socket.on('room:start', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    room.phase = 'soundcheck';
    room.soundCheckBuzzes = [];
    room.message = 'Soundcheck started.';
    room.buzzer.locked = true;
    room.buzzer.firstBuzz = null;
    room.buzzer.buzzOrder = [];

    respond(callback, room);
    emitRoom(room);
  });

  socket.on(
    'question:select',
    (payload: { roomCode: string; questionId: string }, callback: (response: ServerResponse) => void) => {
      const room = requireHostRoom(payload.roomCode, socket.id, callback);
      if (!room) return;

      const question = findQuestion(room, payload.questionId);
      if (!question) {
        callback({ ok: false, error: 'Question not found.' });
        return;
      }

      if (question.used) {
        callback({ ok: false, error: 'Question already used.' });
        return;
      }

      room.phase = 'question';
      const pointsMultiplier = isDoublePointsActive(room) ? 2 : 1;
      const effectivePoints = question.points * pointsMultiplier;

      room.activeQuestion = {
        question,
        revealed: false,
        zoomStep: question.zoomStartIndex ?? 0,
        estimateAnswers: [],
        patchAnswers: [],

        effectivePoints,
        pointsMultiplier,

        estimateAwardedPlayerIds: [],
        estimateAwardedPlayerNames: [],

        pointAwardedPlayerIds: [],
        pointAwardedPlayerNames: [],

        pointPenalizedPlayerIds: [],
        pointPenalizedPlayerNames: [],

        penaltyShieldPlayerIds: [],
        penaltyShieldPlayerNames: [],

        buzzerBlockedPlayerIds: [],
        buzzerBlockedPlayerNames: [],
        buzzerBlockEntries: [],

        abilityBlurred: question.questionType === 'ability-fake',
        abilityView: 'question',

        buzzTimeouts: {},
        progressiveRevealCount: 0,
        progressiveImageRevealed: false,
        memeRevealCount: 0,
        pointPenaltyCounts: {},
      };

      room.buzzer.locked = true;
      room.buzzer.firstBuzz = null;
      room.buzzer.buzzOrder = [];
      room.message =
          pointsMultiplier === 2
              ? `Double points question selected: ${effectivePoints} points. Jokers can be used before reveal.`
              : 'Question selected. Jokers can be used before reveal.';

      setRoomAudio(room, 'stopped', question.soundUrl ?? null);

      respond(callback, room);
      emitRoom(room);
    }
  );

  socket.on('question:reveal', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    if (!room.activeQuestion) {
      callback({ ok: false, error: 'No active question.' });
      return;
    }

    room.activeQuestion.revealed = true;
    room.buzzer.locked = false;
    room.buzzer.firstBuzz = null;
    room.buzzer.buzzOrder = [];
    room.message = 'Question revealed. Buzzer is open.';

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('player:buzz', (payload: { roomCode: string; playerId: string }, callback: (response: ServerResponse) => void) => {
    const room = getRoom(cleanRoomCode(payload.roomCode));
    if (!room) {
      callback({ ok: false, error: 'Room not found.' });
      return;
    }

    const player = room.players.find((item) => item.id === payload.playerId && item.socketId === socket.id);
    if (!player) {
      callback({ ok: false, error: 'Player not found in this room.' });
      return;
    }

    if (room.activeQuestion?.buzzerBlockedPlayerIds?.includes(player.id)) {
      callback({
        ok: false,
        error: 'Your buzzer is blocked for this question.'
      });
      return;
    }

    const timeoutUntil =
        room.activeQuestion?.buzzTimeouts?.[player.id] ?? 0;

    const now = Date.now();

    if (timeoutUntil > now) {
      const secondsLeft = Math.ceil((timeoutUntil - now) / 1000);

      callback({
        ok: false,
        error: `You are timed out for ${secondsLeft} more seconds.`
      });

      return;
    }

    if (room.phase !== 'question' || !room.activeQuestion?.revealed) {
      callback({ ok: false, error: 'No revealed question is active.' });
      return;
    }

    if (room.buzzer.locked) {
      callback({ ok: false, error: 'Buzzer is locked.' });
      return;
    }

    if (room.buzzer.buzzOrder.some((buzz) => buzz.playerId === player.id)) {
      callback({ ok: false, error: 'You already buzzed.' });
      return;
    }

    const buzz = {
      playerId: player.id,
      playerName: player.name,
      timestamp: Date.now()
    };

    room.buzzer.buzzOrder.push(buzz);

    if (!room.buzzer.firstBuzz) {
      room.buzzer.firstBuzz = buzz;
      room.buzzer.locked = true;
      room.message = `${player.name} buzzed first.`;

      playRoomSfx(room, '/sounds/sfx/buzzer.mp3');

      if (room.activeQuestion?.question.questionType === 'ability-fake') {
        room.activeQuestion.abilityBlurred = true;
      }

      if (room.audio.soundUrl) {
        setRoomAudio(room, 'stopped');
      }
    }

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('buzzer:lock', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    room.buzzer.locked = true;
    room.message = 'Buzzer locked.';

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('buzzer:unlock', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    room.buzzer.locked = false;
    if (room.activeQuestion?.question.questionType === 'ability-fake') {
      room.activeQuestion.abilityBlurred = false;
    }
    room.buzzer.firstBuzz = null;
    room.buzzer.buzzOrder = [];
    room.message = 'Buzzer unlocked for everyone.';

    respond(callback, room);
    emitRoom(room);
  });

  socket.on(
      'answer:correct',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (!room.activeQuestion) {
          callback({ ok: false, error: 'No active question.' });
          return;
        }

        if (room.phase === 'answer') {
          respond(callback, room);
          emitRoom(room);
          return;
        }

        const buzzedPlayer = room.buzzer.firstBuzz
            ? room.players.find((item) => item.id === room.buzzer.firstBuzz?.playerId)
            : null;

        markActiveQuestionUsed(room);

        room.phase = 'answer';
        room.buzzer.locked = true;

        if (room.activeQuestion.question.questionType === 'ability-fake') {
          room.activeQuestion.abilityBlurred = false;
          room.activeQuestion.abilityView = 'solution';
        }

        room.message = buzzedPlayer
            ? `${buzzedPlayer.name} answered correctly. Award points manually.`
            : 'Answer revealed. Award points manually.';

        playRoomSfx(room, '/sounds/sfx/correct.mp3');

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'answer:wrong',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        const activeQuestion = room.activeQuestion;
        const firstBuzz = room.buzzer.firstBuzz;

        if (!activeQuestion || !firstBuzz) {
          callback({ ok: false, error: 'No buzzed player to mark wrong.' });
          return;
        }

        const player = room.players.find(
            (item) => item.id === firstBuzz.playerId
        );

        if (!player) {
          callback({ ok: false, error: 'Buzzed player not found.' });
          return;
        }

        activeQuestion.buzzTimeouts = {
          ...(activeQuestion.buzzTimeouts ?? {}),
          [player.id]: Date.now() + 5000
        };

        room.buzzer.firstBuzz = null;
        room.buzzer.buzzOrder = [];
        room.buzzer.locked = false;

        if (activeQuestion.question.questionType === 'ability-fake') {
          activeQuestion.abilityBlurred = false;
        }

        room.message = `${player.name} answered wrong and cannot buzz for 5 seconds.`;

        playRoomSfx(room, '/sounds/sfx/wrong.mp3');

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on(
      'question:close',
      (
          payload: { roomCode: string },
          callback: (response: ServerResponse) => void
      ) => {
        const room = requireHostRoom(payload.roomCode, socket.id, callback);
        if (!room) return;

        if (room.activeQuestion) {
          markActiveQuestionUsed(room);
        }

        resetQuestion(room);
        room.message = 'Back to the board.';

        respond(callback, room);
        emitRoom(room);
      }
  );

  socket.on('disconnect', () => {
    const room = markPlayerDisconnected(socket.id);
    if (room) emitRoom(room);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Quiz server running on port ${PORT}`);
});

function requireHostRoom(
  roomCode: string,
  socketId: string,
  callback: (response: ServerResponse) => void
): Room | null {
  const room = getRoom(cleanRoomCode(roomCode));

  if (!room) {
    callback({ ok: false, error: 'Room not found.' });
    return null;
  }

  if (!isHost(room, socketId)) {
    callback({ ok: false, error: 'Only the host can do this.' });
    return null;
  }

  return room;
}

function resetQuestion(room: Room) {
  room.phase = 'board';
  room.activeQuestion = null;
  room.buzzer.locked = true;
  room.buzzer.firstBuzz = null;
  room.buzzer.buzzOrder = [];
}

function respond(callback: (response: ServerResponse) => void, room: Room, playerId?: string) {
  callback({
    ok: true,
    playerId,
    roomCode: room.roomCode,
    state: getPublicRoom(room)
  });
}

function emitRoom(room: Room) {
  io.to(room.roomCode).emit('game:state', getPublicRoom(room));
}

function cleanRoomCode(roomCode: unknown): string {
  if (typeof roomCode !== 'string') {
    return '';
  }

  return roomCode.trim().toUpperCase();
}

function cleanName(name: string, fallback: string) {
  const cleaned = name.trim();
  return cleaned.length > 0 ? cleaned.slice(0, 24) : fallback;
}
