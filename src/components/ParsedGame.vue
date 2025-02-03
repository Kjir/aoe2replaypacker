<script setup lang="ts">
import { formatDistanceToNow, intlFormat } from 'date-fns'
import CivIcon from '@/components/CivIcon.vue'
import PlayerColor from '@/components/PlayerColor.vue'
import GameReorder from '@/components/GameReorder.vue'
import GameToolbox from '@/components/GameToolbox.vue'
import type { Game } from '@/entities/game'

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
    <div class="w-full flex flex-row justify-center gap-12">
      <div class="flex items-center gap-4">
        <PlayerColor :color="props.game.color1 ?? 0" class="w-9 h-9" />
        <div
          class="w-[150px] text-center overflow-hidden text-ellipsis font-medium dark:text-white"
        >
          <a
            :href="`https://aoe2insights.com/user/relic/${props.game.profile1}`"
            class="text-blue-500 dark:text-blue-400 hover:underline"
            target="_blank"
            >{{ props.game.player1 }}</a
          >
          <!--<div class="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>-->
        </div>
        <CivIcon
          v-if="props.game.civ1"
          :civ="props.game.civ1.toLowerCase()"
          class="w-10 h-10 rounded-full"
        />
      </div>
      <div class="flex items-center gap-4">
        <CivIcon
          v-if="props.game.civ2"
          :civ="props.game.civ2.toLowerCase()"
          class="w-10 h-10 rounded-full"
        />
        <div
          class="w-[150px] text-center overflow-hidden text-ellipsis font-medium dark:text-white"
        >
          <a
            :href="`https://aoe2insights.com/user/relic/${props.game.profile2}`"
            class="text-blue-600 dark:text-blue-500 hover:underline"
            target="_blank"
            >{{ props.game.player2 }}</a
          >
        </div>
        <PlayerColor :color="props.game.color2 ?? 0" class="w-9 h-9" />
      </div>
    </div>
  </div>
</template>
