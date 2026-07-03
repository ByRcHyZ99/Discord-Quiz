<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  'create-room': [hostName: string];
  'join-room': [payload: { roomCode: string; playerName: string }];
}>();

const hostName = ref('Host');
const playerName = ref('Player');
const roomCode = ref('');

function createRoom() {
  if (!hostName.value.trim()) return;
  emit('create-room', hostName.value.trim());
}

function joinRoom() {
  if (!playerName.value.trim() || !roomCode.value.trim()) return;
  emit('join-room', {
    playerName: playerName.value.trim(),
    roomCode: roomCode.value.trim().toUpperCase()
  });
}
</script>

<template>
  <section class="start-screen card">
    <div class="start-screen__intro">
      <p class="eyebrow">Gaming Quiz</p>
      <h1>Test your Knowledge</h1>
      <p>
        Create a room as host or join with a room code. Then share the host screen in Discord.
      </p>
    </div>

    <div class="start-grid">
      <form class="panel" @submit.prevent="createRoom">
        <h2>Create room</h2>
        <label>
          Host name
          <input v-model="hostName" type="text" maxlength="24" />
        </label>
        <button type="submit">Create as Host</button>
      </form>

      <form class="panel" @submit.prevent="joinRoom">
        <h2>Join room</h2>
        <label>
          Player name
          <input v-model="playerName" type="text" maxlength="24" />
        </label>
        <label>
          Room code
          <input v-model="roomCode" type="text" maxlength="8" placeholder="ABCD" />
        </label>
        <button type="submit">Join Game</button>
      </form>
    </div>
  </section>
</template>
