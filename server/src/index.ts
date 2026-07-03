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

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});



io.on('connection', (socket) => {
  socket.on('room:create', (payload: { hostName: string }, callback: (response: ServerResponse) => void) => {
    const hostName = cleanName(payload.hostName, 'Host');
    const { room, player } = createRoom(socket.id, hostName);
    socket.join(room.roomCode);

    respond(callback, room, player.id);
    emitRoom(room);
  });

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
        revealed: false
      };
      room.buzzer.locked = true;
      room.buzzer.firstBuzz = null;
      room.buzzer.buzzOrder = [];
      room.message = 'Question selected.';

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
    room.buzzer.firstBuzz = null;
    room.buzzer.buzzOrder = [];
    room.message = 'Buzzer unlocked for everyone.';

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('answer:correct', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    if (!room.activeQuestion || !room.buzzer.firstBuzz) {
      callback({ ok: false, error: 'No first buzz to mark correct.' });
      return;
    }

    const player = room.players.find((item) => item.id === room.buzzer.firstBuzz?.playerId);
    if (!player) {
      callback({ ok: false, error: 'Buzzing player not found.' });
      return;
    }

    player.score += room.activeQuestion.question.points;
    room.activeQuestion.question.used = true;
    room.message = `${player.name} got ${room.activeQuestion.question.points} points.`;
    resetQuestion(room);

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('answer:wrong', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    if (!room.activeQuestion) {
      callback({ ok: false, error: 'No active question.' });
      return;
    }

    room.buzzer.locked = false;
    room.buzzer.firstBuzz = null;
    room.buzzer.buzzOrder = [];
    room.message = 'Wrong answer or timeout. Buzzer is open again.';

    respond(callback, room);
    emitRoom(room);
  });

  socket.on('question:close', (payload: { roomCode: string }, callback: (response: ServerResponse) => void) => {
    const room = requireHostRoom(payload.roomCode, socket.id, callback);
    if (!room) return;

    if (room.activeQuestion) {
      room.activeQuestion.question.used = true;
    }

    room.message = 'Question closed.';
    resetQuestion(room);

    respond(callback, room);
    emitRoom(room);
  });

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
