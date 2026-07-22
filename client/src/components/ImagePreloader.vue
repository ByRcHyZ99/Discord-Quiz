<script setup lang="ts">
import { watch } from 'vue';
import type { Category, GameState, Question } from '../types/game';

const props = defineProps<{
  state: GameState;
}>();

const loadedUrls = new Set<string>();

function addUrl(urls: Set<string>, value: string | null | undefined) {
  if (!value) return;

  const trimmed = value.trim();
  if (!trimmed) return;

  urls.add(trimmed);
}

function collectQuestionImageUrls(question: Question, urls: Set<string>) {
  addUrl(urls, question.imageUrl);
  addUrl(urls, question.splashUrl);

  addUrl(urls, question.progressiveImageUrl);

  addUrl(urls, question.fusionImageUrl);
  addUrl(urls, question.logoFusionLeftImageUrl);
  addUrl(urls, question.logoFusionRightImageUrl);

  for (const memeImage of question.memeImages ?? []) {
    addUrl(urls, memeImage);
  }

  for (const abilitySlot of question.abilitySlots ?? []) {
    addUrl(urls, abilitySlot.imageUrl);
  }
}

function collectCategoryImageUrls(categories: Category[], urls: Set<string>) {
  for (const category of categories) {
    for (const question of category.questions) {
      collectQuestionImageUrls(question, urls);
    }
  }
}

function preloadImage(url: string) {
  if (loadedUrls.has(url)) return;

  loadedUrls.add(url);

  const image = new Image();
  image.decoding = 'async';
  image.loading = 'eager';
  image.src = url;
}

watch(
    () => props.state,
    (state) => {
      const urls = new Set<string>();

      collectCategoryImageUrls(state.categories, urls);

      for (const board of state.categoryBoards ?? []) {
        collectCategoryImageUrls(board.categories, urls);
      }

      if (state.activeQuestion) {
        collectQuestionImageUrls(state.activeQuestion.question, urls);
      }

      for (const url of urls) {
        preloadImage(url);
      }
    },
    {
      deep: true,
      immediate: true
    }
);
</script>

<template>
  <span aria-hidden="true" class="image-preloader" />
</template>