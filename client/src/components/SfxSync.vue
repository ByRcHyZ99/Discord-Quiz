<script setup lang="ts">
import { ref, watch } from 'vue';
import type { SfxState } from '../types/game';

const props = defineProps<{
  sfx: SfxState;
}>();

const audioElement = ref<HTMLAudioElement | null>(null);
const lastVersion = ref(0);

function clampVolume(volume: number | undefined) {
  if (volume === undefined) return 0.55;
  return Math.max(0, Math.min(1, volume));
}

watch(
    () => props.sfx,
    async (sfxState) => {
      const element = audioElement.value;
      if (!element) return;

      element.volume = clampVolume(sfxState.volume);

      if (!sfxState.soundUrl) return;

      if (sfxState.version === lastVersion.value) return;

      lastVersion.value = sfxState.version;

      element.pause();
      element.currentTime = 0;
      element.src = sfxState.soundUrl;
      element.load();

      try {
        await element.play();
      } catch (error) {
        console.warn('SFX playback was blocked by the browser.', error);
      }
    },
    { deep: true, immediate: true }
);
</script>

<template>
  <audio ref="audioElement" preload="auto" />
</template>