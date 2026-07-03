<script setup lang="ts">
import type { Category } from '../types/game';

defineProps<{
  categories: Category[];
  canSelect: boolean;
}>();

const emit = defineEmits<{
  'select-question': [questionId: string];
}>();
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
          :class="{ 'question-tile--used': question.used }"
          :disabled="question.used || !canSelect"
          @click="emit('select-question', question.id)"
        >
          <span v-if="!question.used">{{ question.points }}</span>
          <span v-else>Used</span>
        </button>
      </div>
    </div>

    <p v-if="!canSelect" class="muted board-note">
      Only the host can select questions.
    </p>
  </section>
</template>
