<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
  state: GameState;
  currentPlayerId: string | null;
}>();

const emit = defineEmits<{
  buzz: [];
  'use-shield-joker': [];
  'use-block-joker': [targetPlayerId: string];
}>();

const now = ref(Date.now());
const stateReceivedAt = ref(Date.now());
const selectedBlockTargetId = ref('');

let intervalId: number | undefined;

watch(
    () => props.state.serverTime,
    () => {
      stateReceivedAt.value = Date.now();
    },
    { immediate: true }
);

watch(
    () => props.state.activeQuestion?.question.id,
    () => {
      selectedBlockTargetId.value = '';
    }
);

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = Date.now();
  }, 250);
});

onUnmounted(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId);
  }
});

const estimatedServerNow = computed(() => {
  return props.state.serverTime + (now.value - stateReceivedAt.value);
});

const currentPlayer = computed(() => {
  if (!props.currentPlayerId) return null;

  return props.state.players.find((player) => player.id === props.currentPlayerId) ?? null;
});

const canUseJokers = computed(() => {
  return (
      props.state.phase === 'question' &&
      Boolean(props.state.activeQuestion) &&
      props.state.activeQuestion?.revealed === false
  );
});

const shieldActiveForMe = computed(() => {
  if (!props.currentPlayerId) return false;

  return props.state.activeQuestion?.penaltyShieldPlayerIds?.includes(props.currentPlayerId) ?? false;
});

const blockUsedThisQuestion = computed(() => {
  if (!props.currentPlayerId) return false;

  return (
      props.state.activeQuestion?.buzzerBlockEntries?.some(
          (entry) => entry.sourcePlayerId === props.currentPlayerId
      ) ?? false
  );
});

const eligibleBlockTargets = computed(() => {
  if (!props.currentPlayerId) return [];

  return props.state.players.filter(
      (player) =>
          player.id !== props.currentPlayerId &&
          player.isConnected
  );
});

const isEstimateQuestion = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType === 'estimate'
  );
});

const timeoutUntil = computed(() => {
  if (!props.currentPlayerId) return 0;

  return props.state.activeQuestion?.buzzTimeouts?.[props.currentPlayerId] ?? 0;
});

const timeoutSecondsLeft = computed(() => {
  const remaining = timeoutUntil.value - estimatedServerNow.value;
  return Math.max(0, Math.ceil(remaining / 1000));
});

const isTimedOut = computed(() => {
  return timeoutSecondsLeft.value > 0;
});

const isBuzzerBlocked = computed(() => {
  if (!props.currentPlayerId) return false;

  return props.state.activeQuestion?.buzzerBlockedPlayerIds?.includes(props.currentPlayerId) ?? false;
});

const canBuzz = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType !== 'estimate' &&
      props.state.activeQuestion.question.questionType !== 'patch-quatsch' &&
      !props.state.buzzer.locked &&
      !isTimedOut.value &&
      !isBuzzerBlocked.value
  );
});

function useBlockJoker() {
  if (!selectedBlockTargetId.value) return;

  emit('use-block-joker', selectedBlockTargetId.value);
}
</script>

<template>
  <section class="panel player-controls">
    <h2>Player controls</h2>

    <div
        v-if="canUseJokers && currentPlayer"
        class="joker-panel"
    >
      <p class="eyebrow">Jokers</p>

      <p class="muted">
        Jokers can only be used before the question is revealed.
      </p>

      <button
          class="joker-button"
          :disabled="!currentPlayer.jokerShieldAvailable || shieldActiveForMe"
          @click="emit('use-shield-joker')"
      >
        {{
        shieldActiveForMe
        ? 'Shield active for this question'
        : currentPlayer.jokerShieldAvailable
        ? 'Use Shield Joker'
        : 'Shield Joker used'
        }}
      </button>

      <div class="joker-block-control">
        <select
            v-model="selectedBlockTargetId"
            :disabled="!currentPlayer.jokerBlockAvailable || blockUsedThisQuestion"
        >
          <option value="">
            Select player to block
          </option>

          <option
              v-for="player in eligibleBlockTargets"
              :key="player.id"
              :value="player.id"
          >
            {{ player.name }}
          </option>
        </select>

        <button
            class="joker-button joker-button--danger"
            :disabled="
            !currentPlayer.jokerBlockAvailable ||
            blockUsedThisQuestion ||
            !selectedBlockTargetId
          "
            @click="useBlockJoker"
        >
          {{
          blockUsedThisQuestion
          ? 'Block Joker active'
          : currentPlayer.jokerBlockAvailable
          ? 'Use Block Joker'
          : 'Block Joker used'
          }}
        </button>
      </div>

      <div
          v-if="state.activeQuestion?.buzzerBlockEntries?.length"
          class="joker-status-list"
      >
        <p
            v-for="entry in state.activeQuestion.buzzerBlockEntries"
            :key="`${entry.sourcePlayerId}-${entry.targetPlayerId}`"
            class="muted"
        >
          {{ entry.sourcePlayerName }} blocked {{ entry.targetPlayerName }}.
        </p>
      </div>
    </div>

    <template v-if="isEstimateQuestion">
      <p class="muted">
        Enter your estimate in the box in the middle of the screen.
      </p>
    </template>

    <template v-else-if="state.phase === 'submissions'">
      <p class="muted">
        Submissions are closed. Player answers are visible now.
      </p>
    </template>

    <template v-else-if="state.phase === 'answer'">
      <p class="muted">
        The correct answer is visible.
      </p>
    </template>

    <template v-else>
      <p v-if="isTimedOut" class="timeout-warning">
        Wrong answer timeout:
        <strong>{{ timeoutSecondsLeft }}s</strong>
      </p>

      <p v-if="isBuzzerBlocked" class="timeout-warning">
        Your buzzer is blocked for this question.
      </p>

      <p v-if="state.buzzer.locked" class="muted">
        Buzzer is locked.
      </p>

      <p v-else-if="isTimedOut" class="muted">
        You cannot buzz until the timeout is over.
      </p>

      <p v-else-if="isBuzzerBlocked" class="muted">
        Another player used a Block Joker on you.
      </p>
    </template>
  </section>
</template>