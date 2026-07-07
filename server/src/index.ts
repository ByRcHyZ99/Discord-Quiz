import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { Room } from './types.js';
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
import type { Room, ServerResponse } from './types.js';

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

        room.message = 'Descriptions reset.';

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
          payload: { roomCode: string; value: string },
          callback: (response: ServerResponse) => void
      ) => {
        const roomCode = cleanRoomCode(payload.roomCode);
        const room = getRoom(roomCode);

        if (!room) {
          callback({ ok: false, error: 'Room not found.' });
          return;
        }

        const player = room.players.find((item) => item.socketId === socket.id);

        if (!player) {
          callback({ ok: false, error: 'Player not found in this room.' });
          return;
        }

        if (
            room.phase !== 'question' ||
            !room.activeQuestion ||
            room.activeQuestion.question.questionType !== 'estimate' ||
            !room.activeQuestion.revealed
        ) {
          callback({ ok: false, error: 'No open estimate question.' });
          return;
        }

        const value = String(payload.value ?? '').trim().slice(0, 120);

        if (!value) {
          callback({ ok: false, error: 'Please enter an answer.' });
          return;
        }

        const existingAnswer = room.activeQuestion.estimateAnswers.find(
            (answer) => answer.playerId === player.id
        );

        if (existingAnswer) {
          existingAnswer.value = value;
          existingAnswer.submittedAt = Date.now();
        } else {
          room.activeQuestion.estimateAnswers.push({
            playerId: player.id,
            playerName: player.name,
            value,
            submittedAt: Date.now()
          });
        }

        room.message = `${player.name} submitted an answer.`;

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
            (answer) => answer.playerId === winner.id
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
                .map((playerId) => room.players.find((player) => player.id === playerId)?.name)
                .filter((name): name is string => Boolean(name));

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

    room.phase = 'board';
    room.message = 'Game started.';
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
      room.activeQuestion = {
        question,
        revealed: false,
        zoomStep: question.zoomStartIndex ?? 0,
        estimateAnswers: [],
        estimateAwardedPlayerIds: [],
        estimateAwardedPlayerNames: [],
        abilityBlurred: false,
        abilityView: 'question',
        buzzTimeouts: {},
        progressiveRevealCount: 0
      };
      room.buzzer.locked = true;
      room.buzzer.firstBuzz = null;
      room.buzzer.buzzOrder = [];
      room.message = 'Question selected.';

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

        if (!room.activeQuestion || !room.buzzer.firstBuzz) {
          callback({ ok: false, error: 'No first buzz to mark correct.' });
          return;
        }

        const player = room.players.find(
            (item) => item.id === room.buzzer.firstBuzz?.playerId
        );

        if (!player) {
          callback({ ok: false, error: 'Buzzing player not found.' });
          return;
        }

        player.score += room.activeQuestion.question.points;

        markActiveQuestionUsed(room);

        room.phase = 'answer';
        room.buzzer.locked = true;

        if (room.activeQuestion?.question.questionType === 'ability-fake') {
          room.activeQuestion.abilityBlurred = false;
          room.activeQuestion.abilityView = 'solution';
        }
        
        room.message = `${player.name} got ${room.activeQuestion.question.points} points.`;

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

        const penalty = Math.round(activeQuestion.question.points / 2);

        player.score -= penalty;

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

        room.message = `${player.name} answered wrong, lost ${penalty} points, and cannot buzz for 5 seconds.`;

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

function cleanRoomCode(roomCode: string) {
  return roomCode.trim().toUpperCase();
}

function cleanName(name: string, fallback: string) {
  const cleaned = name.trim();
  return cleaned.length > 0 ? cleaned.slice(0, 24) : fallback;
}
