<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion } from '../types/game';

const props = defineProps<{
  activeQuestion: ActiveQuestion;
  showAll?: boolean;
}>();

const clues = computed(() => {
  return props.activeQuestion.question.progressiveClues ?? [];
});

const visibleClues = computed(() => {
  if (props.showAll) return clues.value;

  const count = props.activeQuestion.progressiveRevealCount ?? 0;
  return clues.value.slice(0, count);
});
</script>

<template>
  <section class="progressive-question">
    <h2>
      {{ activeQuestion.question.text }}
    </h2>

    <div class="progressive-clue-stage">
      <p
          v-if="visibleClues.length === 0"
          class="progressive-empty"
      >
        Waiting for the first description...
      </p>

      <div
          v-else
          class="progressive-clue-list"
      >
        <article
            v-for="(clue, index) in visibleClues"
            :key="index"
            class="progressive-clue-card"
        >
          <span class="progressive-clue-number">
            {{ index + 1 }}
          </span>

          <p>
            {{ clue }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>