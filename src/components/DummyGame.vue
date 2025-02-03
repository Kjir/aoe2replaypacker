<script setup lang="ts">
import type { Game } from '@/entities/game'

const props = defineProps<{
  index: number
  game: Game
}>()
</script>
<template>
  <div>
    <h3 class="text-center text-2xl">Game {{ props.index + 1 }}</h3>
    <h4 class="text-center text-lg">Placeholder game</h4>
    <p class="text-center text-sm text-gray-500 dark:text-gray-400">
      This a placeholder for a game that wasn't played, either because the opponent conceded the
      Admin Win, or because the set already has a winner from the previous games.
    </p>
  </div>
</template>
