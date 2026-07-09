<script setup lang="ts">
import type { Category } from '../types/game';

const props = defineProps<{
  categories: Category[];
  canSelect: boolean;
  doublePointsActive?: boolean;
}>();

const emit = defineEmits<{
  'select-question': [questionId: string];
}>();

function selectQuestion(questionId: string, used: boolean) {
  if (!props.canSelect || used) return;

  emit('select-question', questionId);
}
</script>

<template>
  <section class="board card">
    <div class="board-grid" :style="{ '--columns': categories.length }">
      <div v-for="category in categories" :key="category.id" class="category-column">
        <div class="category-title">{{ category.title }}</div>

        <button
            v-for="question in category.questions"
            :key="question.id"
            class="question-tile"
            :class="{
    'question-tile--used': question.used,
    'question-tile--viewer': !canSelect && !question.used,
    'question-tile--double': doublePointsActive && !question.used
  }"
            type="button"
            :disabled="question.used"
            :aria-disabled="!canSelect || question.used"
            @click="selectQuestion(question.id, question.used)"
        >
          <span v-if="question.used">—</span>

          <template v-else>
            <span>{{ doublePointsActive ? question.points * 2 : question.points }}</span>

            <small
                v-if="doublePointsActive"
                class="double-points-badge"
            >
              x2
            </small>
          </template>
        </button>
      </div>
    </div>

    <p v-if="!canSelect" class="muted board-note">
      Only the host can select questions.
    </p>
  </section>
</template>
