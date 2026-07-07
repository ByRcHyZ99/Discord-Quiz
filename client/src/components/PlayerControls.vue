<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
  state: GameState;
  currentPlayerId: string | null;
}>();

const emit = defineEmits<{
  buzz: [];
}>();

const now = ref(Date.now());

let intervalId: number | undefined;

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

const isEstimateQuestion = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType === 'estimate'
  );
});

const timeoutUntil = computed(() => {
  if (!props.currentPlayerId) return 0;

  return (
      props.state.activeQuestion?.buzzTimeouts?.[props.currentPlayerId] ?? 0
  );
});

const timeoutSecondsLeft = computed(() => {
  const remaining = timeoutUntil.value - now.value;
  return Math.max(0, Math.ceil(remaining / 1000));
});

const isTimedOut = computed(() => {
  return timeoutSecondsLeft.value > 0;
});

const canBuzz = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType !== 'estimate' &&
      !props.state.buzzer.locked &&
      !isTimedOut.value
  );
});
</script>

<template>
  <section class="panel player-controls">
    <h2>Player controls</h2>

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

      <button
          class="big-action"
          :disabled="!canBuzz"
          @click="emit('buzz')"
      >
        Buzz
      </button>

      <p v-if="state.buzzer.locked" class="muted">
        Buzzer is locked.
      </p>

      <p v-else-if="isTimedOut" class="muted">
        You cannot buzz until the timeout is over.
      </p>
    </template>
  </section>
</template>