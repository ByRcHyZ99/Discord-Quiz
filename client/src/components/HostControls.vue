<script setup lang="ts">
import type { GameState } from '../types/game';

defineProps<{
  state: GameState;
}>();

const emit = defineEmits<{
  'reveal-question': [];
  'unlock-buzzer': [];
  'lock-buzzer': [];
  'mark-correct': [];
  'mark-wrong': [];
  'close-question': [];
  'audio-play': [];
  'audio-pause': [];
  'audio-stop': [];
  'audio-restart': [];
  'audio-volume': [volume: number];
}>();

function handleVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('audio-volume', Number(target.value) / 100);
}
</script>

<template>
  <section class="panel host-controls">
    <h2>Host controls</h2>

    <div v-if="state.phase === 'answer'" class="control-stack">
      <p class="muted">
        The correct answer is visible.
      </p>

      <button class="big-action" @click="emit('close-question')">
        Back to Board
      </button>
    </div>

    <div v-else-if="state.phase === 'question' && state.activeQuestion" class="control-stack">
      <div
          v-if="state.activeQuestion.question.soundUrl"
          class="audio-controls"
      >
        <p class="eyebrow">Sound controls</p>

        <label class="volume-control">
          <span>
            Global Volume: {{ Math.round((state.audio?.volume ?? 0.35) * 100) }}%
          </span>

          <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="Math.round((state.audio?.volume ?? 0.35) * 100)"
              @input="handleVolumeInput"
          />
        </label>

        <button @click="emit('audio-play')">
          Play from Start
        </button>

        <button @click="emit('audio-pause')">
          Pause
        </button>

        <button @click="emit('audio-stop')">
          Stop
        </button>

        <button @click="emit('audio-restart')">
          Restart
        </button>
      </div>

      <button
          v-if="!state.activeQuestion.revealed"
          class="big-action"
          @click="emit('reveal-question')"
      >
        Reveal Question
      </button>

      <template v-else>
        <button @click="emit('unlock-buzzer')">
          Unlock Buzzer
        </button>

        <button @click="emit('lock-buzzer')">
          Lock Buzzer
        </button>

        <button
            class="success"
            :disabled="!state.buzzer.firstBuzz"
            @click="emit('mark-correct')"
        >
          Mark First Buzz Correct
        </button>

        <button
            class="danger"
            :disabled="!state.buzzer.firstBuzz"
            @click="emit('mark-wrong')"
        >
          Mark First Buzz Wrong / Timeout
        </button>

        <button class="secondary" @click="emit('close-question')">
          Close Question / Back to Board
        </button>
      </template>
    </div>

    <p v-else class="muted">
      Select a question from the board.
    </p>
  </section>
</template>