<script setup lang="ts">
import { formatDistanceToNow, intlFormat } from 'date-fns'
import GameReorder from '@/components/GameReorder.vue'
import GameToolbox from '@/components/GameToolbox.vue'
import type { Game } from '@/entities/game'
import GameTeam from '@/components/GameTeam.vue'

const props = defineProps<{
  index: number
  game: Game
}>()
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
    <div class="w-full grid grid-cols-2 gap-12 justify-items-center mt-4 mb-4">
      <GameTeam v-for="team in props.game.teams" :key="team.id" :team="team" />
    </div>
  </div>
</template>
