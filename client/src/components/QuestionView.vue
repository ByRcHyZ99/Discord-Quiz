<script setup lang="ts">
import type { GameState } from '../types/game';

defineProps<{
  state: GameState;
}>();
</script>

<template>
  <section class="question-view card">
    <div class="question-meta">
      <span v-if="state.activeQuestion" class="badge">
        {{ state.activeQuestion.question.points }} pts
      </span>

      <span
          v-if="state.phase === 'question'"
          class="badge"
          :class="state.buzzer.locked ? 'badge--danger' : 'badge--success'"
      >
        Buzzer {{ state.buzzer.locked ? 'locked' : 'open' }}
      </span>

      <span v-if="state.phase === 'answer'" class="badge badge--success">
        Answer
      </span>
    </div>

    <template v-if="state.phase === 'answer'">
      <template v-if="state.activeQuestion">
        <p class="eyebrow">Correct answer</p>

        <h2 class="answer-text">
          {{ state.activeQuestion.question.answer }}
        </h2>

        <p class="muted">
          {{ state.message }}
        </p>
      </template>

      <template v-else>
        <h2>Answer screen</h2>
        <p class="muted">
          No active question found. The server reset the question too early.
        </p>
      </template>
    </template>

    <template v-else-if="state.activeQuestion?.revealed">
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

    <template v-else-if="state.activeQuestion">
      <h2>Question selected</h2>
      <p class="muted">Waiting for the host to reveal it.</p>
    </template>

    <template v-else>
      <h2>No question selected</h2>
      <p class="muted">The game state is missing an active question.</p>
    </template>
  </section>
</template>
