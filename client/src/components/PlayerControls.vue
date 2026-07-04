<script setup lang="ts">
import { computed } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
  state: GameState;
}>();

const emit = defineEmits<{
  buzz: [];
}>();

const isEstimateQuestion = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType === 'estimate'
  );
});

const canBuzz = computed(() => {
  return (
      props.state.phase === 'question' &&
      props.state.activeQuestion?.revealed &&
      props.state.activeQuestion.question.questionType !== 'estimate' &&
      !props.state.buzzer.locked
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
    </template>
  </section>
</template>