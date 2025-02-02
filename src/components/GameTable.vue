<script setup lang="ts">
import { formatDistanceToNow, intlFormat } from 'date-fns'
import CivIcon from '@/components/CivIcon.vue'
import PlayerColor from '@/components/PlayerColor.vue'
import GameToolbox from '@/components/GameToolbox.vue'
import { useGamesStore } from '@/stores/games'

const gamesStore = useGamesStore()
</script>
<template>
  <div class="flex flex-col items-center gap-4 p-4 border-2 rounded-lg col-span-3 mt-4">
    <p v-if="!gamesStore.hasGames" class="text-gray-500 dark:text-gray-400">No games selected
      yet.</p>
    <div v-else v-for="(game, index) in Object.values(gamesStore.gamesInfo)" :key="game.date.valueOf()"
      class="w-full max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 relative">
      <GameToolbox class="absolute right-4" />
      <h3 class="text-center text-2xl">Game {{ index + 1 }}</h3>
      <h4 class="text-center text-lg">{{ game?.mapName }}</h4>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400"><abbr v-if="game" :title="intlFormat(game.date, {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
        ">{{ formatDistanceToNow(game.date) }} ago</abbr></p>
      <div class="w-full flex flex-row justify-center gap-12">

        <div class="flex items-center gap-4">
          <PlayerColor :color="game.color1" class="w-9 h-9" />
          <div class="w-[150px] text-center overflow-hidden text-ellipsis font-medium dark:text-white">
            <a :href="`https://aoe2insights.com/user/relic/${game?.profile1}`"
              class="text-blue-500 dark:text-blue-400 hover:underline" target="_blank">{{ game?.player1 }}</a>
            <!--<div class="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>-->
          </div>
          <CivIcon :civ="game.civ1.toLowerCase()" class="w-10 h-10 rounded-full" />
        </div>
        <div class="flex items-center gap-4">
          <CivIcon :civ="game.civ2.toLowerCase()" class="w-10 h-10 rounded-full" />
          <div class="w-[150px] text-center overflow-hidden text-ellipsis font-medium dark:text-white">
            <a :href="`https://aoe2insights.com/user/relic/${game?.profile2}`"
              class="text-blue-600 dark:text-blue-500 hover:underline" target="_blank">{{ game?.player2 }}</a>
          </div>
          <PlayerColor :color="game.color2" class="w-9 h-9" />
        </div>
      </div>
    </div>
  </div>
</template>
