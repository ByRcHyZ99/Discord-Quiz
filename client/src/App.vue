<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { socket } from './services/socket';
import type { GameState, ServerResponse } from './types/game';
import StartScreen from './components/StartScreen.vue';
import LobbyScreen from './components/LobbyScreen.vue';
import GameBoard from './components/GameBoard.vue';
import QuestionView from './components/QuestionView.vue';
import Scoreboard from './components/Scoreboard.vue';
import PlayerControls from './components/PlayerControls.vue';
import HostControls from './components/HostControls.vue';

const gameState = ref<GameState | null>(null);
const currentPlayerId = ref<string | null>(null);
const connectionError = ref('');

const SESSION_STORAGE_KEY = 'discord-quiz-session';

type SavedSession = {
  roomCode: string;
  playerId: string;
};

const currentPlayer = computed(() => {
  if (!gameState.value || !currentPlayerId.value) return null;
  return gameState.value.players.find((player) => player.id === currentPlayerId.value) ?? null;
});

const isHost = computed(() => currentPlayer.value?.isHost === true);

function saveSession(roomCode: string, playerId: string) {
  localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        roomCode,
        playerId
      })
  );
}

function loadSession(): SavedSession | null {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as SavedSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function restoreSession() {
  const savedSession = loadSession();
  if (!savedSession) return;

  socket.emit(
      'room:restore',
      {
        roomCode: savedSession.roomCode,
        playerId: savedSession.playerId
      },
      (response: ServerResponse) => {
        if (!response.ok) {
          clearSession();
          gameState.value = null;
          currentPlayerId.value = null;
          connectionError.value = '';
          return;
        }

        handleResponse(response);
      }
  );
}

onMounted(() => {
  socket.connect();

  socket.on('connect', () => {
    connectionError.value = '';
    restoreSession();
  });

  socket.on('connect_error', () => {
    connectionError.value = 'Could not connect to the quiz server. Is the backend running?';
  });

  socket.on('game:state', (state: GameState) => {
    gameState.value = state;
  });
});

function handleResponse(response: ServerResponse) {
  if (!response.ok) {
    connectionError.value = response.error ?? 'Something went wrong.';
    return;
  }

  connectionError.value = '';

  if (response.playerId) {
    currentPlayerId.value = response.playerId;
  }

  if (response.state) {
    gameState.value = response.state;
  }

  if (response.roomCode && response.playerId) {
    saveSession(response.roomCode, response.playerId);
  }
}

function createRoom(hostName: string) {
  socket.emit('room:create', { hostName }, handleResponse);
}

function joinRoom(payload: { roomCode: string; playerName: string }) {
  socket.emit('room:join', payload, handleResponse);
}

function startGame() {
  if (!gameState.value) return;
  socket.emit('room:start', { roomCode: gameState.value.roomCode }, handleResponse);
}

function selectQuestion(questionId: string) {
  if (!gameState.value || !isHost.value) return;
  socket.emit('question:select', { roomCode: gameState.value.roomCode, questionId }, handleResponse);
}

function revealQuestion() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('question:reveal', { roomCode: gameState.value.roomCode }, handleResponse);
}

function buzz() {
  if (!gameState.value || !currentPlayerId.value) return;
  socket.emit(
    'player:buzz',
    { roomCode: gameState.value.roomCode, playerId: currentPlayerId.value },
    handleResponse
  );
}

function lockBuzzer() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('buzzer:lock', { roomCode: gameState.value.roomCode }, handleResponse);
}

function unlockBuzzer() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('buzzer:unlock', { roomCode: gameState.value.roomCode }, handleResponse);
}

function markCorrect() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('answer:correct', { roomCode: gameState.value.roomCode }, handleResponse);
}

function markWrong() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('answer:wrong', { roomCode: gameState.value.roomCode }, handleResponse);
}

function closeQuestion() {
  if (!gameState.value || !isHost.value) return;
  socket.emit('question:close', { roomCode: gameState.value.roomCode }, handleResponse);
}
</script>

<template>
  <main class="app-shell">
    <section v-if="connectionError" class="error-box">
      {{ connectionError }}
    </section>

    <StartScreen
      v-if="!gameState"
      @create-room="createRoom"
      @join-room="joinRoom"
    />

    <template v-else>
      <header class="top-bar">
        <div>
          <p class="eyebrow">Room</p>
          <h1>{{ gameState.roomCode }}</h1>
        </div>

        <div class="top-bar__right">
          <span v-if="currentPlayer" class="badge">
            {{ currentPlayer.name }}{{ isHost ? ' · Host' : '' }}
          </span>
          <span class="badge badge--phase">{{ gameState.phase }}</span>
        </div>
      </header>

      <LobbyScreen
        v-if="gameState.phase === 'lobby'"
        :players="gameState.players"
        :is-host="isHost"
        @start-game="startGame"
      />

      <section v-else class="game-layout">
        <aside class="side-panel">
          <Scoreboard :players="gameState.players" />

          <PlayerControls
            v-if="!isHost"
            :buzzer="gameState.buzzer"
            :active-question="gameState.activeQuestion"
            :current-player-id="currentPlayerId"
            @buzz="buzz"
          />

          <HostControls
            v-else
            :state="gameState"
            @reveal-question="revealQuestion"
            @lock-buzzer="lockBuzzer"
            @unlock-buzzer="unlockBuzzer"
            @mark-correct="markCorrect"
            @mark-wrong="markWrong"
            @close-question="closeQuestion"
          />
        </aside>

        <section class="main-panel">
          <QuestionView
              v-if="gameState.phase === 'question' || gameState.phase === 'answer'"
              :state="gameState"
          />

          <GameBoard
              v-else
              :categories="gameState.categories"
              :can-select="isHost"
              @select-question="selectQuestion"
          />
        </section>
      </section>
    </template>
  </main>
</template>
