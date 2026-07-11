<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion } from '../types/game';

const props = defineProps<{
  activeQuestion: ActiveQuestion;
  showAll?: boolean;
  firstBuzzName?: string | null;
}>();

const memes = computed(() => {
  return props.activeQuestion.question.memeImages ?? [];
});

const visibleMemes = computed(() => {
  if (props.showAll) return memes.value;

  const count = props.activeQuestion.memeRevealCount ?? 0;
  return memes.value.slice(0, count);
});
</script>

<template>
  <section class="meme-question">
    <h2>
      {{ activeQuestion.question.text }}
    </h2>

    <div
        v-if="firstBuzzName"
        class="meme-buzzed-box"
    >
      <strong>{{ firstBuzzName }} buzzed!</strong>
      <span>Waiting for host decision...</span>
    </div>

    <div class="meme-stage">
      <p
          v-if="visibleMemes.length === 0"
          class="meme-empty"
      >
        Waiting for the first meme...
      </p>

      <div
          v-else
          class="meme-grid"
      >
        <article
            v-for="(meme, index) in visibleMemes"
            :key="`${meme}-${index}`"
            class="meme-card"
        >
          <span class="meme-number">
            Meme {{ index + 1 }}
          </span>

          <img
              :src="meme"
              :alt="`Meme ${index + 1}`"
          />
        </article>
      </div>
    </div>
  </section>
</template>