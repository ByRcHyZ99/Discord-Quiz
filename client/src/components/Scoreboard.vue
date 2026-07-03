<script setup lang="ts">
import type { Player } from '../types/game';

defineProps<{
  players: Player[];
}>();
</script>

<template>
  <section class="scoreboard panel">
    <h2>Scoreboard</h2>
    <ul>
      <li v-for="player in players" :key="player.id" class="score-row">
        <span>{{ player.name }}</span>
        <strong>{{ player.score }}</strong>
      </li>
    </ul>
  </section>
</template>
