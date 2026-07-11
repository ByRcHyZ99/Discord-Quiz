<script setup lang="ts">
import { computed } from 'vue';
import type { GameState } from '../types/game';

const props = defineProps<{
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

  'ability-show-question': [];
  'ability-show-solution': [];
  'ability-blur': [];
  'ability-reveal': [];

  'progressive-reveal-next': [];
  'progressive-hide-last': [];
  'progressive-reset': [];

  'points-set-award': [payload: { playerId: string; awarded: boolean }];
  'points-set-penalty': [payload: { playerId: string; penalized: boolean }];

  'board-switch': [boardIndex: number];

  'meme-reveal-next': [];
  'meme-hide-last': [];
  'meme-reset': [];

  'progressive-reveal-image': [];
}>();

function isPointPenalized(playerId: string) {
  return activeQuestion.value?.pointPenalizedPlayerIds?.includes(playerId) ?? false;
}

function hasPenaltyShield(playerId: string) {
  return activeQuestion.value?.penaltyShieldPlayerIds?.includes(playerId) ?? false;
}

function isBuzzerBlocked(playerId: string) {
  return activeQuestion.value?.buzzerBlockedPlayerIds?.includes(playerId) ?? false;
}

function togglePointPenalty(playerId: string) {
  emit('points-set-penalty', {
    playerId,
    penalized: !isPointPenalized(playerId)
  });
}

const activeQuestion = computed(() => props.state.activeQuestion);

const questionType = computed(() => {
  return activeQuestion.value?.question.questionType ?? 'normal';
});

const isEstimateQuestion = computed(() => {
  return questionType.value === 'estimate';
});

const isAbilityFakeQuestion = computed(() => {
  return questionType.value === 'ability-fake';
});

const isProgressiveQuestion = computed(() => {
  return questionType.value === 'progressive';
});

const isLogoFusionQuestion = computed(() => {
  return questionType.value === 'logo-fusion';
});

const canRevealAnswer = computed(() => {
  return (
      Boolean(activeQuestion.value?.revealed) &&
      (
          Boolean(props.state.buzzer.firstBuzz) ||
          isLogoFusionQuestion.value
      )
  );
});

const isMemeRevealQuestion = computed(() => {
  return questionType.value === 'meme-reveal';
});

const memeRevealCount = computed(() => {
  return activeQuestion.value?.memeRevealCount ?? 0;
});

const memeTotalCount = computed(() => {
  return activeQuestion.value?.question.memeImages?.length ?? 0;
});

const canRevealNextMeme = computed(() => {
  return memeRevealCount.value < memeTotalCount.value;
});

const canHideMeme = computed(() => {
  return memeRevealCount.value > 0;
});

const hasSoundQuestion = computed(() => {
  return Boolean(activeQuestion.value?.question.soundUrl);
});

const hasZoomImage = computed(() => {
  return activeQuestion.value?.question.imageMode === 'zoom';
});

const questionPoints = computed(() => {
  return activeQuestion.value?.effectivePoints ?? activeQuestion.value?.question.points ?? 0;
});

const questionPenalty = computed(() => {
  return Math.round(questionPoints.value / 2);
});

const questionMultiplier = computed(() => {
  return activeQuestion.value?.pointsMultiplier ?? 1;
});

const progressiveRevealCount = computed(() => {
  return activeQuestion.value?.progressiveRevealCount ?? 0;
});

const progressiveTotalCount = computed(() => {
  return activeQuestion.value?.question.progressiveClues?.length ?? 0;
});

const canRevealNextProgressiveClue = computed(() => {
  return progressiveRevealCount.value < progressiveTotalCount.value;
});

const canHideProgressiveClue = computed(() => {
  return progressiveRevealCount.value > 0;
});

const hasProgressiveImage = computed(() => {
  return Boolean(activeQuestion.value?.question.progressiveImageUrl);
});

const canRevealProgressiveImage = computed(() => {
  if (!activeQuestion.value) return false;

  const totalClues = activeQuestion.value.question.progressiveClues?.length ?? 0;
  const revealedClues = activeQuestion.value.progressiveRevealCount ?? 0;

  return (
      hasProgressiveImage.value &&
      revealedClues >= totalClues &&
      activeQuestion.value.progressiveImageRevealed !== true
  );
});

const showManualPoints = computed(() => {
  return (
      Boolean(activeQuestion.value?.revealed) &&
      (
          props.state.phase === 'question' ||
          props.state.phase === 'submissions' ||
          props.state.phase === 'answer'
      )
  );
});

function isPointAwarded(playerId: string) {
  return activeQuestion.value?.pointAwardedPlayerIds?.includes(playerId) ?? false;
}

function togglePointAward(playerId: string) {
  emit('points-set-award', {
    playerId,
    awarded: !isPointAwarded(playerId)
  });
}

function handleAudioVolume(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('audio-volume', Number(target.value) / 100);
}
</script>

<template>
  <section class="panel host-controls">
    <h2>Host controls</h2>

    <p v-if="state.message" class="muted">
      {{ state.message }}
    </p>

    <!-- BOARD -->
    <template v-if="state.phase === 'board'">
      <p class="muted">
        Select a question on the board.
      </p>

      <div class="board-switcher">
        <p class="eyebrow">Boards</p>

        <button
            v-for="board in state.boards"
            :key="board.id"
            class="board-switch-button"
            :class="{
        'board-switch-button--active': board.index === state.activeBoardIndex
      }"
            @click="emit('board-switch', board.index)"
        >
          <span>{{ board.title }}</span>

          <strong>
            {{ board.usedCount }} / {{ board.totalCount }} used
          </strong>
        </button>
      </div>
    </template>

    <!-- QUESTION PHASE -->
    <template v-else-if="state.phase === 'question' && activeQuestion">
      <div class="control-stack">
        <template v-if="!activeQuestion.revealed">
          <p class="eyebrow">Question selected</p>

          <button
              class="big-action"
              @click="emit('reveal-question')"
          >
            Reveal Question
          </button>

          <button @click="emit('close-question')">
            Back to Board
          </button>
        </template>

        <template v-else>
          <p class="eyebrow">
            Active question · {{ questionPoints }} pts
          </p>

          <!-- AUDIO QUESTION CONTROLS -->
          <div
              v-if="hasSoundQuestion"
              class="audio-controls"
          >
            <p class="eyebrow">Audio</p>

            <button @click="emit('audio-play')">
              Play
            </button>

            <button @click="emit('audio-pause')">
              Pause
            </button>

            <button @click="emit('audio-restart')">
              Restart
            </button>

            <button @click="emit('audio-stop')">
              Stop
            </button>

            <label class="volume-control">
              <span>Volume</span>

              <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  :value="Math.round((state.audio.volume ?? 0.35) * 100)"
                  @input="handleAudioVolume"
              />
            </label>
          </div>

          <!-- IMAGE ZOOM CONTROLS -->
          <div
              v-if="hasZoomImage"
              class="image-controls"
          >
            <p class="eyebrow">Image zoom</p>

            <button @click="emit('image-reveal-more')">
              Reveal More
            </button>

            <button @click="emit('image-reveal-less')">
              Reveal Less
            </button>

            <button @click="emit('image-reset')">
              Reset Image
            </button>
          </div>

          <!-- PROGRESSIVE / RIOT CONTROLS -->
          <div
              v-if="isProgressiveQuestion"
              class="progressive-controls"
          >
            <p class="eyebrow">Progressive descriptions</p>

            <p class="muted">
              Revealed:
              {{ progressiveRevealCount }}
              /
              {{ progressiveTotalCount }}
            </p>

            <button
                class="big-action"
                :disabled="!canRevealNextProgressiveClue"
                @click="emit('progressive-reveal-next')"
            >
              Reveal Next Description
            </button>

            <button
                class="big-action"
                :disabled="!canRevealProgressiveImage"
                @click="emit('progressive-reveal-image')"
            >
              Reveal Image
            </button>

            <button
                :disabled="!canHideProgressiveClue"
                @click="emit('progressive-hide-last')"
            >
              Hide Last Description
            </button>

            <button
                :disabled="!canHideProgressiveClue"
                @click="emit('progressive-reset')"
            >
              Reset Descriptions
            </button>
          </div>

          <!-- MEME IT CONTROLS -->
          <div
              v-if="isMemeRevealQuestion"
              class="meme-controls"
          >
            <p class="eyebrow">Meme reveal</p>

            <p class="muted">
              Revealed:
              {{ memeRevealCount }}
              /
              {{ memeTotalCount }}
            </p>

            <button
                class="big-action"
                :disabled="!canRevealNextMeme"
                @click="emit('meme-reveal-next')"
            >
              Reveal Next Meme
            </button>

            <button
                :disabled="!canHideMeme"
                @click="emit('meme-hide-last')"
            >
              Hide Last Meme
            </button>

            <button
                :disabled="!canHideMeme"
                @click="emit('meme-reset')"
            >
              Reset Memes
            </button>
          </div>

          <!-- ESTIMATE QUESTION CONTROLS -->
          <div
              v-if="isEstimateQuestion"
              class="estimate-controls"
          >
            <p class="eyebrow">Estimate question</p>

            <button
                class="big-action"
                @click="emit('estimate-close')"
            >
              Close Submissions
            </button>
          </div>

          <!-- NORMAL BUZZER CONTROLS -->
          <div
              v-else
              class="buzzer-controls"
          >
            <p class="eyebrow">Buzzer</p>

            <button
                :disabled="!state.buzzer.locked"
                @click="emit('unlock-buzzer')"
            >
              Unlock Buzzer
            </button>

            <button
                :disabled="state.buzzer.locked"
                @click="emit('lock-buzzer')"
            >
              Lock Buzzer
            </button>

            <button
                class="big-action"
                :disabled="!canRevealAnswer"
                @click="emit('mark-correct')"
            >
              {{
                isLogoFusionQuestion && !state.buzzer.firstBuzz
                    ? 'Reveal Logo Solution'
                    : 'Mark Correct / Reveal Answer'
              }}
            </button>

            <button
                class="danger"
                :disabled="!state.buzzer.firstBuzz"
                @click="emit('mark-wrong')"
            >
              Mark Wrong
            </button>

            <p v-if="state.buzzer.firstBuzz" class="muted">
              First buzz:
              <strong>{{ state.buzzer.firstBuzz.playerName }}</strong>
            </p>

            <p v-else class="muted">
              No player has buzzed yet.
            </p>
          </div>

          <button @click="emit('close-question')">
            Back to Board
          </button>
        </template>
      </div>
    </template>

    <!-- SUBMISSIONS PHASE -->
    <template v-else-if="state.phase === 'submissions' && activeQuestion">
      <div class="control-stack">
        <p class="eyebrow">Submissions closed</p>

        <button
            class="big-action"
            @click="emit('estimate-reveal-answer')"
        >
          Reveal Correct Answer
        </button>

        <button @click="emit('close-question')">
          Back to Board
        </button>
      </div>
    </template>

    <!-- ANSWER PHASE -->
    <template v-else-if="state.phase === 'answer' && activeQuestion">
      <div class="control-stack">
        <p class="eyebrow">Answer screen</p>

        <button
            class="big-action"
            @click="emit('close-question')"
        >
          Back to Board
        </button>
      </div>
    </template>

    <!-- FALLBACK -->
    <template v-else>
      <p class="muted">
        No host controls available for this phase.
      </p>
    </template>

    <!-- ABILITY FAKE / VIEGO'D CONTROLS -->
    <div
        v-if="activeQuestion && activeQuestion.revealed && isAbilityFakeQuestion"
        class="ability-controls"
    >
      <p class="eyebrow">Ability View</p>

      <button
          class="big-action"
          @click="emit('ability-reveal')"
      >
        Reveal / Unblur Images
      </button>

      <button @click="emit('ability-blur')">
        Blur Images
      </button>

      <button @click="emit('ability-show-question')">
        Show Question View
      </button>

      <button @click="emit('ability-show-solution')">
        Show Solution View
      </button>
    </div>

    <!-- MANUAL POINT MANAGEMENT -->
    <div
        v-if="showManualPoints && activeQuestion"
        class="manual-award-list"
    >
      <p class="eyebrow">Manual points</p>

      <p
          v-if="questionMultiplier === 2"
          class="double-points-host-info"
      >
        Double Points active: this question is worth {{ questionPoints }} points.
      </p>

      <p class="muted">
        Give {{ questionPoints }} points or apply a wrong-answer penalty of
        {{ questionPenalty }} points.
      </p>

      <div
          v-if="activeQuestion.penaltyShieldPlayerNames?.length"
          class="joker-status-list"
      >
        <p class="eyebrow">Shield Jokers</p>

        <p class="muted">
          Penalty shield active for:
          <strong>{{ activeQuestion.penaltyShieldPlayerNames.join(', ') }}</strong>
        </p>
      </div>

      <div
          v-if="activeQuestion.buzzerBlockEntries?.length"
          class="joker-status-list"
      >
        <p class="eyebrow">Block Jokers</p>

        <p
            v-for="entry in activeQuestion.buzzerBlockEntries"
            :key="`${entry.sourcePlayerId}-${entry.targetPlayerId}`"
            class="muted"
        >
          {{ entry.sourcePlayerName }} blocked {{ entry.targetPlayerName }}.
        </p>
      </div>

      <div
          v-for="player in state.players"
          :key="player.id"
          class="manual-award-row"
      >
    <span class="manual-award-player">
      {{ player.name }}
    </span>

        <button
            class="manual-award-button"
            :class="{
        'manual-award-button--selected': isPointAwarded(player.id)
      }"
            @click="togglePointAward(player.id)"
        >
          {{
          isPointAwarded(player.id)
          ? 'Remove points'
          : `Give ${questionPoints} pts`
          }}
        </button>

        <button
            class="manual-penalty-button"
            :class="{
        'manual-penalty-button--selected': isPointPenalized(player.id)
      }"
            :disabled="hasPenaltyShield(player.id)"
            @click="togglePointPenalty(player.id)"
        >
          {{
          hasPenaltyShield(player.id)
          ? 'Shield active'
          : isPointPenalized(player.id)
          ? 'Remove penalty'
          : `Penalty -${questionPenalty} pts`
          }}
        </button>
      </div>

      <p
          v-if="(activeQuestion.pointAwardedPlayerNames ?? []).length"
          class="muted"
      >
        Points awarded to:
        <strong>
          {{ (activeQuestion.pointAwardedPlayerNames ?? []).join(', ') }}
        </strong>
      </p>

      <p
          v-if="(activeQuestion.pointPenalizedPlayerNames ?? []).length"
          class="muted"
      >
        Penalties applied to:
        <strong>
          {{ (activeQuestion.pointPenalizedPlayerNames ?? []).join(', ') }}
        </strong>
      </p>
    </div>
  </section>
</template>