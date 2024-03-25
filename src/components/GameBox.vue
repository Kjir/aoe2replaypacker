<script setup lang="ts">
import ReplayBox from './ReplayBox.vue'

import { Game } from '../entities/game'

const props = defineProps<{
  gameNumber: number
  game: Game
}>()

defineEmits<{
  removeReplay: [idx: number]
  addReplay: []
  updateReplay: [idx: number, file: File | null]
}>()
</script>

<template>
  <div class="border-2 mt-4 grid grid-cols-4 divide-x-2">
    <div class="p-4 col-span-1 bg-slate-100">
      <h3 class="text-center text-xl">Game {{ props.gameNumber + 1 }}</h3>
    </div>
    <div class="col-span-3">
      <div class="divide-y-2">
        <ReplayBox
          v-for="(replay, idx) in props.game.replays"
          :game="game"
          :key="replay.id"
          :replay-number="idx"
          @remove-replay="$emit('removeReplay', idx)"
          @update-replay="(file) => $emit('updateReplay', idx, file)"
        />
        <div class="p-2">
          <button @click="$emit('addReplay')" class="btn btn-gray">Add extra replay</button>
        </div>
      </div>
    </div>
  </div>
</template>
