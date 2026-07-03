<script setup lang="ts">
import type { Player } from '../types/game';

defineProps<{
  players: Player[];
  isHost: boolean;
}>();

const emit = defineEmits<{
  'start-game': [];
}>();
</script>

<template>
  <section class="card lobby-screen">
    <div class="section-heading">
      <p class="eyebrow">Lobby</p>
      <h2>Waiting for players</h2>
      <p>Waiting for everyone to join ...</p>
    </div>

    <ul class="player-list">
      <li v-for="player in players" :key="player.id" class="player-list__item">
        <span>{{ player.name }}</span>
        <span class="badge" :class="{ 'badge--host': player.isHost }">
          {{ player.isHost ? 'Host' : 'Player' }}
        </span>
      </li>
    </ul>

    <button v-if="isHost" class="big-action" @click="emit('start-game')">
      Start Game
    </button>

    <p v-else class="muted">Waiting for host to start. Truly thrilling, but necessary.</p>
  </section>
</template>
