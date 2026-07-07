<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { socket } from './services/socket';
import type { GameState, ServerResponse } from './types/game';
import StartScreen from './components/StartScreen.vue';
import LobbyScreen from './components/LobbyScreen.vue';
import GameBoard from './components/GameBoard.vue';
import QuestionView from './components/QuestionView.vue';
import Scoreboard from './components/Scoreboard.vue';
import PlayerControls from './components/PlayerControls.vue';
import HostControls from './components/HostControls.vue';
import AudioSync from './components/AudioSync.vue';

const gameState = ref<GameState | null>(null);
const currentPlayerId = ref<string | null>(null);
const connectionError = ref('');
const estimateValue = ref('');
const estimateSubmitted = ref(false);

const SESSION_STORAGE_KEY = 'discord-quiz-session';

type SavedSession = {
  roomCode: string;
  playerId: string;
};

const showEstimateInput = computed(() => {
  return (
      gameState.value?.phase === 'question' &&
      gameState.value.activeQuestion?.revealed === true &&
      gameState.value.activeQuestion.question.questionType === 'estimate' &&
      !isHost.value
  );
});

watch(
    () => gameState.value?.activeQuestion?.question.id,
    () => {
      estimateValue.value = '';
      estimateSubmitted.value = false;
    }
);

const currentPlayer = computed(() => {
  if (!gameState.value || !currentPlayerId.value) return null;
  return gameState.value.players.find((player) => player.id === currentPlayerId.value) ?? null;
});

const isHost = computed(() => currentPlayer.value?.isHost === true);

function saveSession(roomCode: string, playerId: string) {
  sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        roomCode,
        playerId
      })
  );
}

function playAudio() {
  if (!gameState.value) return;

  socket.emit(
      'audio:play',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function pauseAudio() {
  if (!gameState.value) return;

  socket.emit(
      'audio:pause',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function stopAudio() {
  if (!gameState.value) return;

  socket.emit(
      'audio:stop',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function submitEstimateFromOverlay() {
  if (!gameState.value) return;

  const value = estimateValue.value.trim();
  if (!value) return;

  socket.emit(
      'estimate:submit',
      {
        roomCode: gameState.value.roomCode,
        value
      },
      handleResponse
  );

  estimateSubmitted.value = true;
}

function submitEstimateAnswer(value: string) {
  if (!gameState.value) return;

  socket.emit(
      'estimate:submit',
      {
        roomCode: gameState.value.roomCode,
        value
      },
      handleResponse
  );
}

function closeEstimates() {
  if (!gameState.value) return;

  socket.emit(
      'estimate:close',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function revealEstimateAnswer() {
  if (!gameState.value) return;

  socket.emit(
      'estimate:reveal-answer',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function awardEstimatePoints(playerId: string) {
  if (!gameState.value) return;

  socket.emit(
      'estimate:award',
      {
        roomCode: gameState.value.roomCode,
        playerId
      },
      handleResponse
  );
}

function restartAudio() {
  if (!gameState.value) return;

  socket.emit(
      'audio:restart',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function setAudioVolume(volume: number) {
  if (!gameState.value) return;

  socket.emit(
      'audio:volume',
      {
        roomCode: gameState.value.roomCode,
        volume
      },
      handleResponse
  );
}

function revealImageMore() {
  if (!gameState.value) return;

  socket.emit(
      'image:reveal-more',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function revealImageLess() {
  if (!gameState.value) return;

  socket.emit(
      'image:reveal-less',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function resetImageZoom() {
  if (!gameState.value) return;

  socket.emit(
      'image:reset',
      { roomCode: gameState.value.roomCode },
      handleResponse
  );
}

function loadSession(): SavedSession | null {
  const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as SavedSession;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
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

function showAbilityQuestionView() {
  if (!gameState.value) return;

  socket.emit(
      'ability:set-view',
      {
        roomCode: gameState.value.roomCode,
        view: 'question'
      },
      handleResponse
  );
}

function showAbilitySolutionView() {
  if (!gameState.value) return;

  socket.emit(
      'ability:set-view',
      {
        roomCode: gameState.value.roomCode,
        view: 'solution'
      },
      handleResponse
  );
}

function startGame() {
  if (!gameState.value) return;
  socket.emit('room:start', { roomCode: gameState.value.roomCode }, handleResponse);
}

function leaveGame() {
  const roomCode = gameState.value?.roomCode;
  const playerId = currentPlayerId.value;

  let finished = false;

  function finishLeave() {
    if (finished) return;
    finished = true;

    clearSession();

    gameState.value = null;
    currentPlayerId.value = null;
    connectionError.value = '';

    socket.disconnect();

    setTimeout(() => {
      socket.connect();
    }, 100);
  }

  if (!roomCode || !playerId || !socket.connected) {
    finishLeave();
    return;
  }

  socket.emit(
      'room:leave',
      {
        roomCode,
        playerId
      },
      () => {
        finishLeave();
      }
  );

  setTimeout(() => {
    finishLeave();
  }, 800);
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
  <div
      v-if="showEstimateInput"
      class="estimate-overlay"
  >
    <section class="estimate-modal">
      <p class="eyebrow">Your estimate</p>

      <h2>
        {{ gameState?.activeQuestion?.question.text }}
      </h2>

      <p class="muted">
        Write your answer here. Other players cannot see it yet.
      </p>

      <input
          v-model="estimateValue"
          class="estimate-input"
          type="text"
          maxlength="120"
          placeholder="Your estimate / answer..."
          @keydown.enter.prevent="submitEstimateFromOverlay"
      />

      <button
          class="big-action"
          :disabled="!estimateValue.trim()"
          @click="submitEstimateFromOverlay"
      >
        {{ estimateSubmitted ? 'Update Answer' : 'Submit Answer' }}
      </button>

      <p v-if="estimateSubmitted" class="muted">
        Submitted. You can update it until the host closes estimates.
      </p>
    </section>
  </div>
  <main class="app-shell">
    <button
        v-if="gameState"
        class="leave-game-button"
        type="button"
        @click="leaveGame"
    >
      Leave Game
    </button>
    <AudioSync
        v-if="gameState"
        :audio="gameState.audio"
    />
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
              :state="gameState"
              @buzz="buzz"
          />

          <HostControls
              v-if="isHost && gameState"
              :state="gameState"
              @reveal-question="revealQuestion"
              @unlock-buzzer="unlockBuzzer"
              @lock-buzzer="lockBuzzer"
              @mark-correct="markCorrect"
              @mark-wrong="markWrong"
              @close-question="closeQuestion"
              @audio-play="playAudio"
              @audio-pause="pauseAudio"
              @audio-stop="stopAudio"
              @audio-restart="restartAudio"
              @audio-volume="setAudioVolume"
              @image-reveal-more="revealImageMore"
              @image-reveal-less="revealImageLess"
              @image-reset="resetImageZoom"
              @estimate-close="closeEstimates"
              @estimate-reveal-answer="revealEstimateAnswer"
              @estimate-award="awardEstimatePoints"
              @ability-show-question="showAbilityQuestionView"
              @ability-show-solution="showAbilitySolutionView"
          />
        </aside>

        <section class="main-panel">
          <QuestionView
              v-if="
    gameState.phase === 'question' ||
    gameState.phase === 'submissions' ||
    gameState.phase === 'answer'
  "
              :state="gameState"
              :is-host="isHost"
          />

          <GameBoard
              v-else-if="gameState.phase === 'board'"
              :categories="gameState.categories"
              :can-select="isHost"
              @select-question="selectQuestion"
          />

          <div v-else class="card">
            <h2>Unknown game state</h2>
            <p>Phase: {{ gameState.phase }}</p>
          </div>
        </section>
      </section>
    </template>
  </main>
</template>
