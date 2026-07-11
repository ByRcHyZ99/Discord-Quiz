<script setup lang="ts">
import { computed } from 'vue';
import type { GameState } from '../types/game';
import AbilityFakeQuestionView from './AbilityFakeQuestionView.vue';
import ProgressiveQuestionView from './ProgressiveQuestionView.vue';
import MemeQuestionView from './MemeQuestionView.vue';
import LogoFusionQuestionView from './LogoFusionQuestionView.vue';

const props = defineProps<{
  state: GameState;
  isHost: boolean;
}>();

const state = computed(() => props.state);

const currentZoomScale = computed(() => {
  const activeQuestion = props.state.activeQuestion;
  if (!activeQuestion) return 1;

  const levels = activeQuestion.question.zoomLevels;
  if (!levels || levels.length === 0) return 1;

  return levels[activeQuestion.zoomStep] ?? 1;
});

const hasImage = computed(() => {
  return Boolean(props.state.activeQuestion?.question.imageUrl);
});

const isZoomImage = computed(() => {
  return props.state.activeQuestion?.question.imageMode === 'zoom';
});
</script>

<template>
  <section class="question-view card">
    <div class="question-meta">
      <span v-if="state.activeQuestion" class="badge">
{{ state.activeQuestion.effectivePoints ?? state.activeQuestion.question.points }} pts
      </span>

      <span
          v-if="state.phase === 'question'"
          class="badge"
          :class="state.buzzer.locked ? 'badge--danger' : 'badge--success'"
      >
        Buzzer {{ state.buzzer.locked ? 'locked' : 'open' }}
      </span>

      <span v-if="state.phase === 'submissions'" class="badge badge--success">
        Submissions
      </span>

      <span v-if="state.phase === 'answer'" class="badge badge--success">
        Answer
      </span>
    </div>

    <!-- ESTIMATE SUBMISSIONS SCREEN -->
    <template v-if="state.phase === 'submissions'">
      <template v-if="state.activeQuestion">
        <p class="eyebrow">Player answers</p>

        <h2>
          {{ state.activeQuestion.question.text }}
        </h2>

        <div
            v-if="state.activeQuestion.estimateAnswers.length"
            class="estimate-answer-list"
        >
          <div
              v-for="answer in state.activeQuestion.estimateAnswers"
              :key="answer.playerId"
              class="estimate-answer-card"
          >
            <strong>{{ answer.playerName }}</strong>
            <span>{{ answer.value }}</span>
          </div>
        </div>

        <p v-else class="muted">
          Nobody submitted an answer.
        </p>
      </template>

      <template v-else>
        <h2>No active question</h2>
        <p class="muted">
          The game state is missing an active question.
        </p>
      </template>
    </template>

    <!-- ANSWER SCREEN -->
    <template v-else-if="state.phase === 'answer'">
      <template v-if="state.activeQuestion">
        <template v-if="state.activeQuestion.question.questionType === 'ability-fake'">
          <p class="eyebrow">Correct answer</p>

          <AbilityFakeQuestionView
              :active-question="state.activeQuestion"
              :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
          />
        </template>

        <template v-else-if="state.activeQuestion.question.questionType === 'progressive'">
          <ProgressiveQuestionView
              :active-question="state.activeQuestion"
              :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
              show-all
          />

          <div class="progressive-answer-box">
            <p class="eyebrow">Correct answer</p>

            <h2 class="answer-text">
              {{ state.activeQuestion.question.answer }}
            </h2>
          </div>
        </template>

        <template v-else-if="state.activeQuestion.question.questionType === 'meme-reveal'">
          <MemeQuestionView
              :active-question="state.activeQuestion"
              :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
              show-all
          />

          <div class="meme-answer-box">
            <p class="eyebrow">Correct answer</p>

            <h2 class="answer-text">
              {{ state.activeQuestion.question.answer }}
            </h2>
          </div>
        </template>

        <template v-else-if="state.activeQuestion.question.questionType === 'logo-fusion'">
          <LogoFusionQuestionView
              :active-question="state.activeQuestion"
              :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
              show-answer
          />
        </template>

        <template v-else>
          <p class="eyebrow">Correct answer</p>

          <h2 class="answer-text">
            {{ state.activeQuestion.question.answer }}
          </h2>

          <div
              v-if="
              state.activeQuestion.question.questionType === 'estimate' &&
              state.activeQuestion.estimateAnswers.length
            "
              class="estimate-answer-list"
          >
            <div
                v-for="answer in state.activeQuestion.estimateAnswers"
                :key="answer.playerId"
                class="estimate-answer-card"
            >
              <strong>{{ answer.playerName }}</strong>
              <span>{{ answer.value }}</span>
            </div>
          </div>

          <div
              v-if="hasImage"
              class="question-image-frame question-image-frame--answer"
          >
            <img
                :src="state.activeQuestion.question.imageUrl"
                alt="Question image"
                class="question-image"
            />
          </div>

          <p class="muted">
            {{ state.message }}
          </p>
        </template>
      </template>

      <template v-else>
        <h2>Answer screen reached</h2>
        <p class="muted">
          But activeQuestion is missing.
        </p>
      </template>
    </template>

    <!-- QUESTION SCREEN -->
    <template v-else-if="state.activeQuestion?.revealed">
      <AbilityFakeQuestionView
          v-if="state.activeQuestion.question.questionType === 'ability-fake'"
          :active-question="state.activeQuestion"
          :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
      />

      <ProgressiveQuestionView
          v-else-if="state.activeQuestion.question.questionType === 'progressive'"
          :active-question="state.activeQuestion"
          :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
      />

      <MemeQuestionView
          v-else-if="state.activeQuestion.question.questionType === 'meme-reveal'"
          :active-question="state.activeQuestion"
          :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
      />

      <LogoFusionQuestionView
          v-else-if="state.activeQuestion.question.questionType === 'logo-fusion'"
          :active-question="state.activeQuestion"
          :first-buzz-name="state.buzzer.firstBuzz?.playerName ?? null"
      />

      <template v-else>
        <h2>
          {{ state.activeQuestion.question.text }}
        </h2>

        <div
            v-if="hasImage && isZoomImage"
            class="question-image-frame question-image-frame--zoom"
        >
          <img
              :src="state.activeQuestion.question.imageUrl"
              alt="Question image"
              class="question-image question-image--zoom"
              :style="{ transform: `scale(${currentZoomScale})` }"
          />
        </div>

        <div
            v-else-if="hasImage"
            class="question-image-frame"
        >
          <img
              :src="state.activeQuestion.question.imageUrl"
              alt="Question image"
              class="question-image"
          />
        </div>

        <div v-if="state.buzzer.firstBuzz" class="first-buzz">
          <p class="eyebrow">First buzz</p>
          <strong>{{ state.buzzer.firstBuzz.playerName }}</strong>
        </div>

        <div v-if="state.buzzer.buzzOrder.length" class="buzz-order">
          <p class="eyebrow">Buzz order</p>

          <ol>
            <li
                v-for="buzz in state.buzzer.buzzOrder"
                :key="buzz.playerId"
            >
              {{ buzz.playerName }}
            </li>
          </ol>
        </div>
      </template>
    </template>

    <!-- SELECTED BUT NOT REVEALED -->
    <template v-else-if="state.activeQuestion">
      <h2>Question selected</h2>
      <p class="muted">Waiting for the host to reveal it.</p>
    </template>

    <!-- FALLBACK -->
    <template v-else>
      <h2>No active question</h2>
      <p class="muted">The game state is missing an active question.</p>
    </template>
  </section>
</template>