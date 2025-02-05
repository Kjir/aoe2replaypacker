<script setup lang="ts">
import { formatDistanceToNow, intlFormat } from 'date-fns'
import GameReorder from '@/components/GameReorder.vue'
import GameToolbox from '@/components/GameToolbox.vue'
import type { Game } from '@/entities/game'
import GameTeam from '@/components/GameTeam.vue'
import winner from '@/assets/crown.svg'
import loser from '@/assets/skull.svg'
import { computed } from 'vue'

const props = defineProps<{
  index: number
  game: Game
}>()

const emit = defineEmits<{
  setWinner: [winner: 'left' | 'none' | 'right']
}>()

const leftName = computed(() => props.game.teams?.[0]?.players?.[0]?.name)
const rightName = computed(() => {
  if (typeof props.game.teams == 'undefined') {
    return ''
  }
  const teamsCount = props.game.teams.length
  return props.game.teams[teamsCount - 1]?.players?.[0]?.name
})
</script>
<template>
  <div>
    <GameReorder class="absolute left-0 top-0" />
    <GameToolbox class="absolute right-0 top-1" :game="props.index" />
    <h3 class="text-center text-2xl">Game {{ props.index + 1 }}</h3>
    <h4 class="text-center text-lg">{{ props.game.mapName }}</h4>
    <p v-if="props.game.date" class="text-center text-sm text-gray-500 dark:text-gray-400">
      <abbr
        :title="
          intlFormat(props.game.date, {
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          })
        "
        >{{ formatDistanceToNow(props.game.date) }} ago</abbr
      >
    </p>
    <div class="flex mt-6 pl-6 pr-6">
      <div class="inline-flex w-1/2 h-full">
        <input
          type="radio"
          :id="`winner-${props.index + 1}`"
          :name="`winlose-${props.index + 1}`"
          class="peer hidden"
          @change="emit('setWinner', 'left')"
          :checked="props.game.winner == 'left'"
          :value="'left'"
        />
        <label
          :for="`winner-${props.index + 1}`"
          class="inline-flex items-center justify-center w-full p-2 bg-white border-r border-l-2 border-y-2 rounded-l-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            :src="props.game.winner == 'left' ? winner : loser"
            width="35"
            height="35"
            class="-mt-1 -mb-1"
          />
          {{ leftName }}
        </label>
      </div>
      <div class="inline-flex w-1/2 h-full">
        <input
          type="radio"
          :id="`loser-${props.index + 1}`"
          :name="`winlose-${props.index + 1}`"
          class="peer hidden"
          @change="emit('setWinner', 'right')"
          :checked="props.game.winner == 'right'"
          :value="'right'"
        />
        <label
          :for="`loser-${props.index + 1}`"
          class="inline-flex items-center justify-center w-full p-2 text-gray-500 bg-white border-l border-r-2 border-y-2 rounded-r-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {{ rightName }}
          <img
            :src="props.game.winner == 'right' ? winner : loser"
            width="35"
            height="35"
            class="-mt-1 -mb-1"
          />
        </label>
      </div>
    </div>
    <div class="w-full grid grid-cols-2 gap-12 justify-items-between mt-4 mb-12 pl-6 pr-6">
      <GameTeam v-for="team in props.game.teams" :key="team.id" :team="team" />
    </div>
  </div>
</template>
