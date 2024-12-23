<script setup lang="ts">
import { formatDistanceToNow, intlFormat } from 'date-fns'
import ReplayBox from './ReplayBox.vue'
import { ref, useId, watch, computed } from 'vue'
import { Game } from '../entities/game'
import { useGamesStore } from '@/stores/games'
import CivIcon from '@/components/CivIcon.vue'

const props = defineProps<{
  gameNumber: number
  game: Game
  leftPlayer: string
  rightPlayer: string
}>()

const emit = defineEmits<{
  removeReplay: [idx: number]
  addReplay: []
  updateReplay: [idx: number, file: File | null]
  setWinner: ['left' | 'none' | 'right']
}>()

const gamesStore = useGamesStore()

const id = useId()
const winner = ref<'left' | 'none' | 'right'>('none')
watch(winner, (newWinner, oldWinner) => {
  if (newWinner == oldWinner) {
    return
  }
  emit('setWinner', newWinner)
})

const gamesInfo = computed(() => {
  return props.game.replays
    .filter(replay => {
      if (!replay || !replay.file || !replay.file.name) {
        return false;
      }
      const name = replay.file.name
      return name in gamesStore.gamesInfo
    })
    .map((replay) => {
      const name = replay.file?.name ?? "" // This check is not needed, but Typescript doesn't know...
      return gamesStore.gamesInfo[name]
    })
})
</script>

<template>
  <div class="border-2 mt-4 grid grid-cols-5 divide-x-2">
    <div class="p-4 col-span-2 bg-slate-100 dark:bg-slate-800">
      <h3 class="text-center text-xl">Game {{ props.gameNumber + 1 }}</h3>
      <div class="flex flex-row w-full">
        <div class="flex grow basis-1/3 overflow-hidden">
          <input type="radio" :id="`${id}_left`" :name="`${id}_winner`" class="hidden peer" value="left"
            v-model="winner" :checked="winner == 'left'" />
          <label :for="`${id}_left`"
            class="inline-flex items-center justify-between w-full pl-2 text-gray-500 bg-white border-l-2 border-y-2 rounded-l-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-center w-19/20 truncate text-lg font-semibold">
              {{ leftPlayer }}
            </div>
          </label>
        </div>
        <div class="flex flex-none">
          <input type="radio" :id="`${id}_none`" :name="`${id}_winner`" class="hidden peer" value="none"
            v-model="winner" :checked="winner == 'none'" />
          <label :for="`${id}_none`"
            class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-r border-l border-y-2 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-center w-full text-lg font-semibold">none</div>
          </label>
        </div>
        <div class="flex grow basis-1/3 overflow-hidden">
          <input type="radio" :id="`${id}_right`" :name="`${id}_winner`" class="hidden peer" value="right"
            v-model="winner" :checked="winner == 'right'" />
          <label :for="`${id}_right`"
            class="inline-flex items-center justify-between w-full pl-2 text-gray-500 bg-white border-l border-r-2 border-y-2 border-l-0 rounded-r-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-center w-19/20 text-lg truncate font-semibold">{{ rightPlayer }}</div>
          </label>
        </div>
      </div>
      <div v-for="game in gamesInfo" :key="game.date.valueOf()" class="w-full">
        <a :href="`https://aoe2insights.com/user/relic/${game?.profile1}`"
          class="text-blue-600 dark:text-blue-500 hover:underline" target="_blank">{{ game?.player1 }}</a>
        <CivIcon v-if="game" :civ="game.civ1.toLowerCase()" /> vs
        <CivIcon v-if="game" :civ="game.civ2.toLowerCase()" />
        <a :href="`https://aoe2insights.com/user/relic/${game?.profile2}`"
          class="text-blue-600 dark:text-blue-500 hover:underline" target="_blank">{{ game?.player2 }}</a>
        on {{ game?.mapName }} (<abbr v-if="game" :title="intlFormat(game.date, {
          weekday: 'short',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })
          ">{{ formatDistanceToNow(game.date) }} ago</abbr>)
      </div>
    </div>
    <div class="col-span-3">
      <div class="divide-y-2">
        <ReplayBox v-for="(replay, idx) in props.game.replays" :game="game" :key="replay.id" :replay-number="idx"
          @remove-replay="$emit('removeReplay', idx)" @update-replay="(file) => $emit('updateReplay', idx, file)" />
        <div class="p-2 grid grid-cols-[auto_2fr] gap-4">
          <button @click="$emit('addReplay')" class="btn btn-gray">
            Add restore for game {{ props.gameNumber + 1 }}
          </button>
          <div class="p-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
            Add more replays if you had to restore a dropped game.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
