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
import SfxSync from './components/SfxSync.vue';
import SoundCheckScreen from './components/SoundCheckScreen.vue';

const gameState = ref<GameState | null>(null);
const currentPlayerId = ref<string | null>(null);
const connectionError = ref('');
const estimateValue = ref('');
const estimateSubmitted = ref(false);

const SESSION_STORAGE_KEY = 'discord-quiz-session';

const SFX_VOLUME_KEY = 'discord-quiz-sfx-volume';

function loadLocalSfxVolume() {
  const rawVolume = localStorage.getItem(SFX_VOLUME_KEY);
  if (!rawVolume) return 1;

  const parsedVolume = Number(rawVolume);
  if (Number.isNaN(parsedVolume)) return 1;

  return Math.max(0, Math.min(1, parsedVolume));
}

const sfxLocalVolume = ref(loadLocalSfxVolume());

watch(sfxLocalVolume, (volume) => {
  localStorage.setItem(SFX_VOLUME_KEY, String(volume));
});

function setLocalSfxVolume(volume: number) {
  sfxLocalVolume.value = Math.max(0, Math.min(1, volume));
}

function testSoundCheckBuzz() {
  if (!gameState.value || !currentPlayerId.value) return;

  socket.emit(
      'soundcheck:buzz',
      {
        roomCode: gameState.value.roomCode,
        playerId: currentPlayerId.value
      },
      handleResponse
  );
}

function switchBoard(boardIndex: number) {
  if (!gameState.value || !isHost.value) return;

  socket.emit(
      'board:switch',
      {
        roomCode: gameState.value.roomCode,
        boardIndex
      },
      handleResponse
  );
}

function playSoundCheckTestSound() {
  if (!gameState.value || !isHost.value) return;

  socket.emit(
      'soundcheck:play-sound',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function resetSoundCheck() {
  if (!gameState.value || !isHost.value) return;

  socket.emit(
      'soundcheck:reset',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function continueToGameBoard() {
  if (!gameState.value || !isHost.value) return;

  socket.emit(
      'soundcheck:continue',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

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
  if (!gameState.value) {
    connectionError.value = 'No active game state.';
    return;
  }

  if (!currentPlayerId.value) {
    connectionError.value = 'Player ID missing. Please rejoin the room.';
    return;
  }

  const value = estimateValue.value.trim();

  if (!value) {
    connectionError.value = 'Estimate cannot be empty.';
    return;
  }

  socket.emit(
      'estimate:submit',
      {
        roomCode: gameState.value.roomCode,
        playerId: currentPlayerId.value,
        value
      },
      (response: ServerResponse) => {
        if (response.ok) {
          estimateSubmitted.value = true;
        }

        handleResponse(response);
      }
  );
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

function setPointPenalty(payload: { playerId: string; penalized: boolean }) {
  if (!gameState.value) return;

  socket.emit(
      'points:set-penalty',
      {
        roomCode: gameState.value.roomCode,
        playerId: payload.playerId,
        penalized: payload.penalized
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

function revealNextProgressiveClue() {
  if (!gameState.value) return;

  socket.emit(
      'progressive:reveal-next',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function hideLastProgressiveClue() {
  if (!gameState.value) return;

  socket.emit(
      'progressive:hide-last',
      {
        roomCode: gameState.value.roomCode
      },
      handleResponse
  );
}

function blurAbilityView() {
  if (!gameState.value) return;

  socket.emit(
      'ability:set-blur',
      {
        roomCode: gameState.value.roomCode,
        blurred: true
      },
      handleResponse
  );
}

function revealAbilityView() {
  if (!gameState.value) return;

  socket.emit(
      'ability:set-blur',
      {
        roomCode: gameState.value.roomCode,
        blurred: false
      },
      handleResponse
  );
}

function resetProgressiveClues() {
  if (!gameState.value) return;

  socket.emit(
      'progressive:reset',
      {
        roomCode: gameState.value.roomCode
      },
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

    const playerIdToSave = response.playerId ?? currentPlayerId.value;

    if (playerIdToSave) {
      saveSession(response.state.roomCode, playerIdToSave);
    }
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

function useShieldJoker() {
  if (!gameState.value || !currentPlayerId.value) return;

  socket.emit(
      'joker:use-shield',
      {
        roomCode: gameState.value.roomCode,
        playerId: currentPlayerId.value
      },
      handleResponse
  );
}

function useBlockJoker(targetPlayerId: string) {
  if (!gameState.value || !currentPlayerId.value) return;

  socket.emit(
      'joker:use-block',
      {
        roomCode: gameState.value.roomCode,
        playerId: currentPlayerId.value,
        targetPlayerId
      },
      handleResponse
  );
}

function setPointAward(payload: { playerId: string; awarded: boolean }) {
  if (!gameState.value) return;

  socket.emit(
      'points:set-award',
      {
        roomCode: gameState.value.roomCode,
        playerId: payload.playerId,
        awarded: payload.awarded
      },
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

    <SfxSync
        v-if="gameState"
        :sfx="gameState.sfx"
        :local-volume="sfxLocalVolume"
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

      <SoundCheckScreen
          v-else-if="gameState.phase === 'soundcheck'"
          :state="gameState"
          :is-host="isHost"
          :current-player-id="currentPlayerId"
          :sfx-volume="sfxLocalVolume"
          @test-buzz="testSoundCheckBuzz"
          @play-test-sound="playSoundCheckTestSound"
          @reset="resetSoundCheck"
          @continue="continueToGameBoard"
          @update-sfx-volume="setLocalSfxVolume"
      />

      <section v-else class="game-layout">
        <aside class="side-panel">
          <Scoreboard :players="gameState.players" />

          <PlayerControls
              v-if="!isHost"
              :state="gameState"
              :current-player-id="currentPlayerId"
              @buzz="buzz"
              @use-shield-joker="useShieldJoker"
              @use-block-joker="useBlockJoker"
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
              @ability-show-question="showAbilityQuestionView"
              @ability-show-solution="showAbilitySolutionView"
              @progressive-reveal-next="revealNextProgressiveClue"
              @progressive-hide-last="hideLastProgressiveClue"
              @progressive-reset="resetProgressiveClues"
              @ability-blur="blurAbilityView"
              @ability-reveal="revealAbilityView"
              @points-set-award="setPointAward"
              @points-set-penalty="setPointPenalty"
              @board-switch="switchBoard"
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
              :double-points-active="gameState.activeBoardDoublePointsActive"
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
