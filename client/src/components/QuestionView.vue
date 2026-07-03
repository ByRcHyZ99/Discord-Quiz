<script setup lang="ts">
import type { GameState } from '../types/game';

defineProps<{
  state: GameState;
}>();
</script>

<template>
  <section class="question-view card">
    <div class="question-meta">
      <span class="badge">{{ state.activeQuestion?.question.points }} pts</span>
      <span class="badge" :class="state.buzzer.locked ? 'badge--danger' : 'badge--success'">
        Buzzer {{ state.buzzer.locked ? 'locked' : 'open' }}
      </span>
    </div>

    <template v-if="state.activeQuestion?.revealed">
      <h2>{{ state.activeQuestion.question.text }}</h2>

      <div v-if="state.buzzer.firstBuzz" class="first-buzz">
        <p class="eyebrow">First buzz</p>
        <strong>{{ state.buzzer.firstBuzz.playerName }}</strong>
      </div>

      <div v-if="state.buzzer.buzzOrder.length" class="buzz-order">
        <p class="eyebrow">Buzz order</p>
        <ol>
          <li v-for="buzz in state.buzzer.buzzOrder" :key="buzz.playerId">
            {{ buzz.playerName }}
          </li>
        </ol>
      </div>
    </template>

    <template v-else>
      <h2>Question selected</h2>
      <p class="muted">Waiting for the host to reveal it.</p>
    </template>
  </section>
</template>
