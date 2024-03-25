<script setup lang="ts">
import { Game, zipFilename, computeReplayFilenamePreview } from '../entities/game'

const props = defineProps<{
  games: Game[]
  player1: string
  player2: string
}>()
</script>

<template>
  <h2 class="text-center text-2xl">Preview</h2>
  <div class="text-left">
    {{ zipFilename(player1, player2) }}<br />
    <template v-for="(game, gameIdx) in props.games">
      <template v-for="(replay, replayIdx) in game.replays">
        <template v-if="gameIdx == props.games.length - 1 && replayIdx == game.replays.length - 1">
          <span
            >└──{{
              computeReplayFilenamePreview(
                props.player1,
                props.player2,
                game,
                gameIdx,
                replay,
                replayIdx
              )
            }}</span
          ><br />
        </template>
        <template v-else>
          <span
            >├──{{
              computeReplayFilenamePreview(
                props.player1,
                props.player2,
                game,
                gameIdx,
                replay,
                replayIdx
              )
            }}</span
          ><br />
        </template>
      </template>
    </template>
  </div>
</template>
