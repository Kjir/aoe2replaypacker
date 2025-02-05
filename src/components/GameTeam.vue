<script setup lang="ts">
import CivIcon from '@/components/CivIcon.vue'
import PlayerColor from '@/components/PlayerColor.vue'
import type { Team } from '@/entities/game'

const { team } = defineProps<{
  team: Team
}>()
</script>

<template>
  <div class="border-4 p-6 rounded-lg shadow-lg flex flex-col justify-stretch">
    <div v-for="player in team.players" :key="player.profile" class="flex items-center gap-4">
      <PlayerColor :color="player.color ?? 0" class="w-9 h-9" />
      <div class="w-[150px] text-center overflow-hidden text-ellipsis font-medium dark:text-white">
        <a
          :href="`https://aoe2insights.com/user/relic/${player.profile}`"
          class="text-blue-500 dark:text-blue-400 hover:underline"
          target="_blank"
          >{{ player.name }}</a
        >
      </div>
      <CivIcon :civ="player.civ.toLowerCase()" class="w-10 h-10 rounded-full" />
    </div>
  </div>
</template>
