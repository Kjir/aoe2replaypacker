<script setup lang="ts">
import { Game, zipFilename, computeReplayFilenamePreview } from '../entities/game'
import type { ReplayMetadata } from '../entities/gamemeta'

const props = defineProps<{
  games: Game[]
  player1: string
  player2: string
  meta: ReplayMetadata
}>()
</script>

<template>
  <h2 class="text-center text-2xl">Preview</h2>
  <div class="text-left">
    {{ zipFilename(player1, player2) }}<br />
    <template v-if="meta.civs || meta.maps"><span>├──metadata.json</span><br /></template>
    <template v-for="(game, gameIdx) in props.games" :key="game.id">
      <template v-if="game.isDummy()">
        <template v-if="gameIdx == props.games.length - 1">
          <span
            >└──{{
              computeReplayFilenamePreview(props.player1, props.player2, game, gameIdx, true, 0)
            }}</span
          ><br />
        </template>
        <template v-else>
          <span
            >├──{{
              computeReplayFilenamePreview(props.player1, props.player2, game, gameIdx, true, 0)
            }}</span
          ><br />
        </template>
      </template>
      <template v-else v-for="(replay, replayIdx) in game.replays" :key="replay.id">
        <template v-if="gameIdx == props.games.length - 1 && replayIdx == game.replays.length - 1">
          <span
            >└──{{
              computeReplayFilenamePreview(
                props.player1,
                props.player2,
                game,
                gameIdx,
                false,
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
                false,
                replayIdx
              )
            }}</span
          ><br />
        </template>
      </template>
    </template>
  </div>
</template>
