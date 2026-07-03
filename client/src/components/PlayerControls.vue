<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion, BuzzerState } from '../types/game';

const props = defineProps<{
  buzzer: BuzzerState;
  activeQuestion: ActiveQuestion | null;
  currentPlayerId: string | null;
}>();

const emit = defineEmits<{
  buzz: [];
}>();

const alreadyBuzzed = computed(() => {
  return props.buzzer.buzzOrder.some((buzz) => buzz.playerId === props.currentPlayerId);
});

const canBuzz = computed(() => {
  return Boolean(
    props.activeQuestion?.revealed &&
    !props.buzzer.locked &&
    !alreadyBuzzed.value
  );
});
</script>

<template>
  <section class="panel player-controls">
    <h2>Player controls</h2>

    <button
      class="buzzer-button"
      :disabled="!canBuzz"
      @click="emit('buzz')"
    >
      Buzz!
    </button>

    <p v-if="alreadyBuzzed" class="muted">You already buzzed.</p>
    <p v-else-if="buzzer.locked" class="muted">Buzzer is locked.</p>
    <p v-else-if="!activeQuestion?.revealed" class="muted">Waiting for a revealed question.</p>
  </section>
</template>
