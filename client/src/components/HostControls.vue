<script setup lang="ts">
import type { GameState } from '../types/game';

defineProps<{
  state: GameState;
}>();

const emit = defineEmits<{
  'reveal-question': [];
  'unlock-buzzer': [];
  'lock-buzzer': [];
  'mark-correct': [];
  'mark-wrong': [];
  'close-question': [];
  'audio-play': [];
  'audio-pause': [];
  'audio-stop': [];
  'audio-restart': [];
  'audio-volume': [volume: number];
  'image-reveal-more': [];
  'image-reveal-less': [];
  'image-reset': [];
  'estimate-close': [];
  'estimate-reveal-answer': [];
  'estimate-award': [playerId: string];
  'ability-show-question': [];
  'ability-show-solution': [];
  'progressive-reveal-next': [];
  'progressive-hide-last': [];
  'progressive-reset': [];
}>();

function handleVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('audio-volume', Number(target.value) / 100);
}
</script>

<template>
  <section class="panel host-controls">
    <h2>Host controls</h2>

    <div v-if="state.phase === 'submissions'" class="control-stack">
      <p class="muted">
        Player answers are now visible.
      </p>

      <div
          v-if="state.activeQuestion?.estimateAnswers.length"
          class="estimate-award-list"
      >
        <p class="eyebrow">Award points</p>

        <button
            v-for="answer in state.activeQuestion.estimateAnswers"
            :key="answer.playerId"
            class="estimate-award-button"
            :class="{
  'estimate-award-button--selected':
    (state.activeQuestion.estimateAwardedPlayerIds ?? []).includes(answer.playerId)
}"
            @click="emit('estimate-award', answer.playerId)"
        >
      <span>
        {{ answer.playerName }}
      </span>

          <strong>
            {{ answer.value }}
          </strong>

          <em>
            {{
            (state.activeQuestion.estimateAwardedPlayerIds ?? []).includes(answer.playerId)
            ? 'Remove points'
            : `Give ${state.activeQuestion.question.points} pts`
            }}
          </em>
        </button>
      </div>

      <p
          v-if="(state.activeQuestion?.estimateAwardedPlayerNames ?? []).length"
          class="muted"
      >
        Points awarded to:
        <strong>
          {{ (state.activeQuestion?.estimateAwardedPlayerNames ?? []).join(', ') }}
        </strong>
      </p>

      <button class="big-action" @click="emit('estimate-reveal-answer')">
        Reveal Correct Answer
      </button>

      <button class="secondary" @click="emit('close-question')">
        Back to Board
      </button>
    </div>

    <div v-else-if="state.phase === 'answer'" class="control-stack">
      <div
          v-if="state.activeQuestion?.question.questionType === 'ability-fake'"
          class="ability-controls"
      >
        <p class="eyebrow">Ability View</p>

        <button @click="emit('ability-show-question')">
          Show Question View
        </button>

        <button @click="emit('ability-show-solution')">
          Show Solution View
        </button>
      </div>
      <p class="muted">
        The correct answer is visible.
      </p>

      <div
          v-if="
      state.activeQuestion?.question.questionType === 'estimate' &&
      state.activeQuestion.estimateAnswers.length
    "
          class="estimate-award-list"
      >
        <p class="eyebrow">Award points</p>

        <button
            v-for="answer in state.activeQuestion.estimateAnswers"
            :key="answer.playerId"
            class="estimate-award-button"
            :class="{
        'estimate-award-button--selected':
          (state.activeQuestion.estimateAwardedPlayerIds ?? []).includes(answer.playerId)
      }"
            @click="emit('estimate-award', answer.playerId)"
        >
      <span>
        {{ answer.playerName }}
      </span>

          <strong>
            {{ answer.value }}
          </strong>

          <em>
            {{
            (state.activeQuestion.estimateAwardedPlayerIds ?? []).includes(answer.playerId)
            ? 'Points awarded'
            : `Give ${state.activeQuestion.question.points} pts`
            }}
          </em>
        </button>
      </div>

      <p
          v-if="(state.activeQuestion?.estimateAwardedPlayerNames ?? []).length"
          class="muted"
      >
        Points awarded to:
        <strong>
          {{ (state.activeQuestion?.estimateAwardedPlayerNames ?? []).join(', ') }}
        </strong>
      </p>

      <button class="big-action" @click="emit('close-question')">
        Back to Board
      </button>
    </div>

    <div v-else-if="state.phase === 'question' && state.activeQuestion" class="control-stack">
      <div
          v-if="
    state.activeQuestion.revealed &&
    state.activeQuestion.question.questionType === 'progressive'
  "
          class="progressive-controls"
      >
        <p class="eyebrow">Progressive descriptions</p>

        <p class="muted">
          Revealed:
          {{ state.activeQuestion.progressiveRevealCount ?? 0 }}
          /
          {{ state.activeQuestion.question.progressiveClues?.length ?? 0 }}
        </p>

        <button
            class="big-action"
            :disabled="
      (state.activeQuestion.progressiveRevealCount ?? 0) >=
      (state.activeQuestion.question.progressiveClues?.length ?? 0)
    "
            @click="emit('progressive-reveal-next')"
        >
          Reveal Next Description
        </button>

        <button
            :disabled="(state.activeQuestion.progressiveRevealCount ?? 0) <= 0"
            @click="emit('progressive-hide-last')"
        >
          Hide Last Description
        </button>

        <button
            :disabled="(state.activeQuestion.progressiveRevealCount ?? 0) <= 0"
            @click="emit('progressive-reset')"
        >
          Reset Descriptions
        </button>
      </div>
      <div
          v-if="state.activeQuestion.question.soundUrl"
          class="audio-controls"
      >
        <p class="eyebrow">Sound controls</p>

        <label class="volume-control">
          <span>
            Global Volume: {{ Math.round((state.audio?.volume ?? 0.35) * 100) }}%
          </span>

          <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="Math.round((state.audio?.volume ?? 0.35) * 100)"
              @input="handleVolumeInput"
          />
        </label>

        <button @click="emit('audio-play')">
          Play from Start
        </button>

        <button @click="emit('audio-pause')">
          Pause
        </button>

        <button @click="emit('audio-stop')">
          Stop
        </button>

        <button @click="emit('audio-restart')">
          Restart
        </button>
      </div>

      <div
          v-if="state.activeQuestion.question.imageMode === 'zoom'"
          class="image-controls"
      >
        <p class="eyebrow">Image controls</p>

        <button @click="emit('image-reveal-more')">
          Reveal More
        </button>

        <button @click="emit('image-reveal-less')">
          Reveal Less
        </button>

        <button @click="emit('image-reset')">
          Reset Image
        </button>

        <p class="muted">
          Zoom step:
          {{ state.activeQuestion.zoomStep + 1 }}
          /
          {{ state.activeQuestion.question.zoomLevels?.length ?? 1 }}
        </p>
      </div>

      <div
          v-if="state.activeQuestion.question.questionType === 'ability-fake'"
          class="ability-controls"
      >
        <p class="eyebrow">Ability View</p>

        <button @click="emit('ability-show-question')">
          Show Question View
        </button>

        <button @click="emit('ability-show-solution')">
          Show Solution View
        </button>
      </div>

      <button
          v-if="!state.activeQuestion.revealed"
          class="big-action"
          @click="emit('reveal-question')"
      >
        Reveal Question
      </button>

      <template v-else>
        <template v-if="state.activeQuestion.question.questionType === 'estimate'">
          <button class="big-action" @click="emit('estimate-close')">
            Close Estimates / Show Player Answers
          </button>

          <button class="secondary" @click="emit('close-question')">
            Cancel / Back to Board
          </button>
        </template>

        <template v-else>
          <button @click="emit('unlock-buzzer')">
            Unlock Buzzer
          </button>

          <button @click="emit('lock-buzzer')">
            Lock Buzzer
          </button>

          <button
              class="success"
              :disabled="!state.buzzer.firstBuzz"
              @click="emit('mark-correct')"
          >
            Mark First Buzz Correct
          </button>

          <button
              class="danger"
              :disabled="!state.buzzer.firstBuzz"
              @click="emit('mark-wrong')"
          >
            Mark Wrong
            <template v-if="state.activeQuestion">
              (-{{ Math.round(state.activeQuestion.question.points / 2) }} pts, 5s timeout)
            </template>
          </button>

          <button class="secondary" @click="emit('close-question')">
            Close Question / Back to Board
          </button>
        </template>
      </template>
    </div>

    <p v-else class="muted">
      Select a question from the board.
    </p>
  </section>
</template>