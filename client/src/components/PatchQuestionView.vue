<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion, PatchChoiceKey } from '../types/game';

const props = defineProps<{
  activeQuestion: ActiveQuestion;
  showSubmissions?: boolean;
  showAnswer?: boolean;
}>();

const question = computed(() => props.activeQuestion.question);

const fakeChoiceKey = computed<PatchChoiceKey | null>(() => {
  if (question.value.patchCorrectChoiceKey) {
    return question.value.patchCorrectChoiceKey;
  }

  const fakeChoice = question.value.patchChoices?.find((choice) => choice.isFake);
  return fakeChoice?.key ?? null;
});

function getAnswersForChoice(choiceKey: PatchChoiceKey) {
  return props.activeQuestion.patchAnswers.filter(
      (answer) => answer.choiceKey === choiceKey
  );
}
</script>

<template>
  <section class="patch-question-view">
    <h2>
      {{ question.text }}
    </h2>

    <p class="muted">
      Which one of these facts is completely made up?
    </p>

    <div class="patch-answer-grid">
      <article
          v-for="choice in question.patchChoices ?? []"
          :key="choice.key"
          class="patch-answer-card"
          :class="{
          'patch-answer-card--correct-fake':
            showAnswer && choice.key === fakeChoiceKey
        }"
      >
        <div class="patch-answer-header">
          <strong>{{ choice.key }}</strong>

          <span
              v-if="showAnswer && choice.key === fakeChoiceKey"
              class="patch-fake-badge"
          >
            Fake
          </span>
        </div>

        <p>
          {{ choice.text }}
        </p>

        <div
            v-if="showSubmissions || showAnswer"
            class="patch-player-answers"
        >
          <span class="muted">
            Chosen by:
          </span>

          <strong v-if="getAnswersForChoice(choice.key).length">
            {{
              getAnswersForChoice(choice.key)
                  .map((answer) => answer.playerName)
                  .join(', ')
            }}
          </strong>

          <em v-else>
            nobody
          </em>
        </div>
      </article>
    </div>

    <div
        v-if="showAnswer"
        class="patch-final-answer-box"
    >
      <p class="eyebrow">Correct fake fact</p>

      <h2 class="answer-text">
        {{ question.answer }}
      </h2>
    </div>
  </section>
</template>