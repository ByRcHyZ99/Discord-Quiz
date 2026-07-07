<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveQuestion } from '../types/game';

const props = defineProps<{
  activeQuestion: ActiveQuestion;
  firstBuzzName?: string | null;
}>();

const question = computed(() => props.activeQuestion.question);

const abilitySlots = computed(() => {
  return question.value.abilitySlots ?? [];
});

const isSolutionView = computed(() => {
  return props.activeQuestion.abilityView === 'solution';
});

const isBlurred = computed(() => {
  return (
      props.activeQuestion.abilityBlurred === true &&
      !isSolutionView.value
  );
});

const fakeSlot = computed(() => {
  return abilitySlots.value.find((slot) => slot.isFake);
});
</script>

<template>
  <section class="ability-fake-card">
    <div
        class="ability-fake-content"
        :class="{ 'ability-fake-content--blurred': isBlurred }"
    >
      <div class="ability-fake-header">
        <div>
          <p class="eyebrow">
            {{ question.champName ?? 'Champion' }}
          </p>

          <h2>
            {{ question.text }}
          </h2>
        </div>

        <strong class="ability-fake-points">
          {{ question.points }} pts
        </strong>
      </div>

      <div
          v-if="question.splashUrl"
          class="ability-splash-frame"
      >
        <img
            :src="question.splashUrl"
            :alt="question.champName ?? 'Champion splash'"
        />
      </div>

      <div class="ability-slots">
        <div
            v-for="slot in abilitySlots"
            :key="slot.key"
            class="ability-slot"
            :class="{
            'ability-slot--fake':
              isSolutionView && slot.isFake
          }"
        >
          <div class="ability-icon-frame">
            <img
                :src="slot.imageUrl"
                :alt="slot.abilityName ?? slot.key"
            />
          </div>

          <strong>
            {{ slot.key }}
          </strong>

          <span
              v-if="isSolutionView && slot.abilityName"
              class="ability-name"
          >
            {{ slot.abilityName }}
          </span>

          <span
              v-if="isSolutionView && slot.isFake && slot.fakeFromChampion"
              class="ability-fake-origin"
          >
            from {{ slot.fakeFromChampion }}
          </span>
        </div>
      </div>

      <div
          v-if="isSolutionView"
          class="ability-solution-box"
      >
        <p class="eyebrow">
          Correct fake ability
        </p>

        <h3>
          {{ question.fakeAbilityKey ?? fakeSlot?.key }}
          <template v-if="question.fakeAbilityName">
            — {{ question.fakeAbilityName }}
          </template>
        </h3>

        <p v-if="question.fakeAbilityFrom">
          This ability is from
          <strong>{{ question.fakeAbilityFrom }}</strong>.
        </p>
      </div>
    </div>

    <div
        v-if="isBlurred"
        class="ability-blur-overlay"
    >
      <strong>
        {{ firstBuzzName ? `${firstBuzzName} buzzed!` : 'Buzzed!' }}
      </strong>

      <span>
    Waiting for host decision...
  </span>
    </div>
  </section>
</template>