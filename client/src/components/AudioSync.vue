<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AudioState } from '../types/game';

const props = defineProps<{
  audio: AudioState;
}>();

const audioElement = ref<HTMLAudioElement | null>(null);
const lastVersion = ref(0);

function clampVolume(volume: number | undefined) {
  if (volume === undefined) return 0.35;
  return Math.max(0, Math.min(1, volume));
}

watch(
    () => props.audio,
    async (audioState) => {
      const element = audioElement.value;
      if (!element) return;

      element.volume = clampVolume(audioState.volume);

      if (!audioState.soundUrl) {
        element.pause();
        element.currentTime = 0;
        return;
      }

      const resolvedSrc = new URL(audioState.soundUrl, window.location.origin).href;

      if (element.src !== resolvedSrc) {
        element.src = audioState.soundUrl;
        element.load();
      }

      if (audioState.version === lastVersion.value) {
        return;
      }

      lastVersion.value = audioState.version;

      if (audioState.status === 'playing') {
        element.pause();
        element.currentTime = 0;

        try {
          await element.play();
        } catch (error) {
          console.warn('Audio playback was blocked by the browser.', error);
        }
      }

      if (audioState.status === 'paused') {
        element.pause();
      }

      if (audioState.status === 'stopped') {
        element.pause();
        element.currentTime = 0;
      }
    },
    { deep: true, immediate: true }
);
</script>

<template>
  <audio ref="audioElement" preload="auto" />
</template>