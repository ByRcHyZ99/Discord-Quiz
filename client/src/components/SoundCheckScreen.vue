<script setup lang="ts">
import { computed } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
  state: GameState;
  isHost: boolean;
  currentPlayerId: string | null;
  sfxVolume: number;
}>();

const emit = defineEmits<{
  'test-buzz': [];
  'play-test-sound': [];
  reset: [];
  continue: [];
  'update-sfx-volume': [volume: number];
}>();

const testedPlayerIds = computed(() => {
  return new Set(props.state.soundCheckBuzzes.map((buzz) => buzz.playerId));
});

const currentPlayerTested = computed(() => {
  if (!props.currentPlayerId) return false;
  return testedPlayerIds.value.has(props.currentPlayerId);
});

function handleVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update-sfx-volume', Number(target.value) / 100);
}
</script>

<template>
  <section class="soundcheck-screen card">
    <div class="soundcheck-header">
      <div>
        <p class="eyebrow">Soundcheck</p>

        <h2>
          Test buzzer and audio before the game starts.
        </h2>

        <p class="muted">
          Everyone should press the test buzzer once and adjust their local sound effect volume.
        </p>
      </div>

      <span class="badge">
        {{ state.soundCheckBuzzes.length }} / {{ state.players.length }} tested
      </span>
    </div>

    <div class="soundcheck-grid">
      <section class="soundcheck-panel">
        <p class="eyebrow">Your test</p>

        <button
            class="big-action"
            @click="emit('test-buzz')"
        >
          {{ currentPlayerTested ? 'Test Buzz Again' : 'Test Buzz' }}
        </button>

        <p class="muted">
          This plays the buzzer sound for everyone and marks you as tested.
        </p>
      </section>

      <section class="soundcheck-panel">
        <p class="eyebrow">Your SFX volume</p>

        <label class="soundcheck-volume">
          <span>
            Local volume: {{ Math.round(sfxVolume * 100) }}%
          </span>

          <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="Math.round(sfxVolume * 100)"
              @input="handleVolumeInput"
          />
        </label>

        <p class="muted">
          This only changes your own browser volume for buzzer, correct and wrong sounds.
        </p>
      </section>
    </div>

    <section class="soundcheck-player-list">
      <p class="eyebrow">Players</p>

      <div
          v-for="player in state.players"
          :key="player.id"
          class="soundcheck-player"
          :class="{ 'soundcheck-player--ready': testedPlayerIds.has(player.id) }"
      >
        <span>
          {{ player.name }}{{ player.isHost ? ' · Host' : '' }}
        </span>

        <strong>
          {{ testedPlayerIds.has(player.id) ? 'Ready' : 'Not tested' }}
        </strong>
      </div>
    </section>

    <section
        v-if="isHost"
        class="soundcheck-host-controls"
    >
      <p class="eyebrow">Host controls</p>

      <button @click="emit('play-test-sound')">
        Play Test Sound
      </button>

      <button @click="emit('reset')">
        Reset Soundcheck
      </button>

      <button
          class="big-action"
          @click="emit('continue')"
      >
        Continue to Game Board
      </button>
    </section>

    <p
        v-else
        class="muted soundcheck-waiting"
    >
      Waiting for the host to continue to the game board.
    </p>
  </section>
</template>