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
    <div class="p-4 col-span-1 bg-slate-100 dark:bg-slate-800">
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
        <div class="p-2 grid grid-cols-[auto_2fr] gap-4">
          <button @click="$emit('addReplay')" class="btn btn-gray">
            Add restore for game {{ props.gameNumber + 1 }}
          </button>
          <div
            class="p-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          >
            Add more replays if you had to restore a dropped game.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
