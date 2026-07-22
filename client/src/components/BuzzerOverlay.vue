<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
  state: GameState;
  currentPlayerId: string | null;
}>();

const emit = defineEmits<{
  buzz: [];
}>();

const now = ref(Date.now());
const stateReceivedAt = ref(Date.now());

let intervalId: number | undefined;

watch(
    () => props.state.serverTime,
    () => {
      stateReceivedAt.value = Date.now();
    },
    { immediate: true }
);

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = Date.now();
  }, 150);
});

onUnmounted(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId);
  }
});

const estimatedServerNow = computed(() => {
  return props.state.serverTime + (now.value - stateReceivedAt.value);
});

const activeQuestion = computed(() => {
  return props.state.activeQuestion;
});

const isEstimateQuestion = computed(() => {
  return activeQuestion.value?.question.questionType === 'estimate';
});

const isPatchQuestion = computed(() => {
  return activeQuestion.value?.question.questionType === 'patch-quatsch';
});

const shouldShowBuzzer = computed(() => {
  return (
      props.state.phase === 'question' &&
      activeQuestion.value?.revealed === true &&
      !isEstimateQuestion.value &&
      !isPatchQuestion.value
  );
});

const timeoutUntil = computed(() => {
  if (!props.currentPlayerId) return 0;

  return activeQuestion.value?.buzzTimeouts?.[props.currentPlayerId] ?? 0;
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

  return activeQuestion.value?.buzzerBlockedPlayerIds?.includes(props.currentPlayerId) ?? false;
});

const canBuzz = computed(() => {
  return (
      shouldShowBuzzer.value &&
      !props.state.buzzer.locked &&
      !isTimedOut.value &&
      !isBuzzerBlocked.value
  );
});

const buttonLabel = computed(() => {
  if (isBuzzerBlocked.value) return 'BLOCKED';
  if (isTimedOut.value) return `${timeoutSecondsLeft.value}s`;
  if (props.state.buzzer.locked) return 'LOCKED';
  return 'BUZZ';
});
</script>

<template>
  <div
      v-if="shouldShowBuzzer"
      class="buzzer-overlay"
  >
    <button
        class="fixed-buzzer-button"
        :class="{
        'fixed-buzzer-button--ready': canBuzz,
        'fixed-buzzer-button--locked': !canBuzz
      }"
        :disabled="!canBuzz"
        @click="emit('buzz')"
    >
      {{ buttonLabel }}
    </button>

    <p
        v-if="isBuzzerBlocked"
        class="buzzer-overlay-status"
    >
      Your buzzer is blocked for this question.
    </p>

    <p
        v-else-if="isTimedOut"
        class="buzzer-overlay-status"
    >
      Wrong answer timeout.
    </p>
  </div>
</template>