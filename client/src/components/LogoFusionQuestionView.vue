<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion } from '../types/game';

const props = defineProps<{
activeQuestion: ActiveQuestion;
showAnswer?: boolean;
firstBuzzName?: string | null;
}>();

const question = computed(() => props.activeQuestion.question);

const leftName = computed(() => {
return question.value.logoFusionLeftName ?? 'Logo 1';
});

const rightName = computed(() => {
return question.value.logoFusionRightName ?? 'Logo 2';
});
</script>

<template>
  <section class="logo-fusion-question">
    <h2>
      {{ question.text }}
    </h2>

    <div
        v-if="firstBuzzName && !showAnswer"
        class="logo-fusion-buzzed-box"
    >
      <strong>{{ firstBuzzName }} buzzed!</strong>
      <span>Waiting for host decision...</span>
    </div>

    <div class="logo-fusion-main-image">
      <p class="eyebrow">
        Fusion Logo
      </p>

      <img
          v-if="question.fusionImageUrl"
          :src="question.fusionImageUrl"
          alt="Fusion logo"
      />

      <p
          v-else
          class="muted"
      >
        No fusion image configured.
      </p>
    </div>

    <div
        v-if="showAnswer"
        class="logo-fusion-answer-area"
    >
      <p class="eyebrow">
        Solution
      </p>

      <div class="logo-fusion-source-grid">
        <article class="logo-fusion-source-card">
          <h3>{{ leftName }}</h3>

          <img
              v-if="question.logoFusionLeftImageUrl"
              :src="question.logoFusionLeftImageUrl"
              :alt="leftName"
          />

          <p
              v-else
              class="muted"
          >
            Missing image.
          </p>
        </article>

        <article class="logo-fusion-source-card">
          <h3>{{ rightName }}</h3>

          <img
              v-if="question.logoFusionRightImageUrl"
              :src="question.logoFusionRightImageUrl"
              :alt="rightName"
          />

          <p
              v-else
              class="muted"
          >
            Missing image.
          </p>
        </article>
      </div>

      <div class="logo-fusion-answer-box">
        <p class="eyebrow">Correct answer</p>

        <h2 class="answer-text">
          {{ question.answer }}
        </h2>
      </div>
    </div>
  </section>
</template>