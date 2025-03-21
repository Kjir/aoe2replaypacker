<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import GameInfo from './GameInfo.vue'
import SetInfo from './SetInfo.vue'
import GameDropzone from './GameDropzone.vue'
import GameTable from './GameTable.vue'
import ZipPreviewPane from './ZipPreviewPane.vue'
import RecentDrafts from './RecentDrafts.vue'
import DiscordMessage from './DiscordMessage.vue'
import ToggleButton from '@/components/ToggleButton.vue'
import { useGamesStore } from '@/stores/games'
import type { ReplayMetadata, ReplayErrors } from '../entities/gamemeta'

import { zipFilename, computeReplayFilename } from '../entities/game'
import { extractDraftUrl } from '../entities/draft'
import { getRandomInt } from '../lib/maths'

const props = defineProps<{
  civPresets: string[] | null
  mapPresets: string[] | null
}>()

const gamesStore = useGamesStore()

const player1 = ref('Player1')
const player2 = ref('Player2')
const boPa = ref<'best-of' | 'play-all'>('best-of')
const mapDraft: Ref<string> = ref('')
const civDraft: Ref<string> = ref('')
const meta: Ref<ReplayMetadata> = ref({
  maps: null,
  civs: null,
  player1_score: null,
  player2_score: null
})
const metaErrors: Ref<ReplayErrors> = ref({ maps: null, civs: null })
const showResults = ref(true)

const downloadWarningReplayMissing = computed(() => {
  if (boPa.value == 'best-of') {
    return false
  }

  for (const game of gamesStore.games) {
    for (const replay of game.replays) {
      if (!replay.file) {
        return true
      }
    }
  }

  return false
})

const leftScore = computed(() => {
  return gamesStore.games.filter((game) => game.winner == 'left').length
})
const rightScore = computed(() => {
  return gamesStore.games.filter((game) => game.winner == 'right').length
})

watch([leftScore, rightScore], ([newLeftScore, newRightScore], [oldLeftScore, oldRightScore]) => {
  if (newLeftScore == oldLeftScore && newRightScore == oldRightScore) {
    return
  }

  if (newLeftScore == 0 && newRightScore == 0) {
    meta.value.player1_score = null
    meta.value.player2_score = null
    return
  }

  meta.value.player1_score = newLeftScore
  meta.value.player2_score = newRightScore
})

const downloadWarningScore = computed(() => {
  if (boPa.value == 'play-all') {
    return false
  }

  if (2 * leftScore.value > gamesStore.games.length + 1) {
    return true
  }
  if (2 * rightScore.value > gamesStore.games.length + 1) {
    return true
  }

  return false
})

const downloadWarningCivDraftMissing = computed(() => {
  if (!props.civPresets || props.civPresets.length == 0) {
    return false
  }

  if (civDraft.value.length > 0) {
    return false
  }

  return true
})

const downloadWarningMapDraftMissing = computed(() => {
  if (!props.mapPresets || props.mapPresets.length == 0) {
    return false
  }

  if (mapDraft.value.length > 0) {
    return false
  }

  return true
})

const downloadEnabled = computed(() => {
  if (metaErrors.value.civs || metaErrors.value.maps) {
    return false
  }

  // Force civ draft entry if preset is specified
  /*if (props.civPresets && !meta.value.civs) {
    return false
  }*/

  // Force map draft entry if preset is specified
  /*if (props.mapPresets && !meta.value.maps) {
    return false
  }*/

  for (const game of gamesStore.games) {
    for (const replay of game.replays) {
      if (replay.file) {
        return true
      }
    }
  }
  return false
})

function getFirstReplayFile(): File | null {
  for (const game of gamesStore.games) {
    for (const replay of game.replays) {
      if (replay.file) {
        return replay.file
      }
    }
  }
  return null
}

function downloadZip() {
  const zip = new JSZip()
  const zipComment = 'Generated by https://replaypacker.zeta-two.com'

  const dummyBase = getFirstReplayFile()
  if (!dummyBase) {
    console.log('Could not find any valid replay files')
    return
  }

  for (const [gameIdx, game] of gamesStore.games.entries()) {
    if (game.isDummy()) {
      const replay_filename = computeReplayFilename(player1.value, player2.value, game, gameIdx, 0)
      const suffixArray = new Uint8Array(getRandomInt(1e5, 3e6))
      //window.crypto.getRandomValues(array);
      const dummyFile = new Blob([dummyBase, suffixArray])
      zip.file(replay_filename, dummyFile)
    } else {
      for (const [replayIdx, replay] of game.replays.entries()) {
        const replay_filename = computeReplayFilename(
          player1.value,
          player2.value,
          game,
          gameIdx,
          replayIdx
        )
        zip.file(replay_filename, replay.file)
      }
    }
  }
  const metaFile = new Blob([JSON.stringify(meta.value)], { type: 'application/json' })
  zip.file('metadata.json', metaFile)

  zip
    .generateAsync({
      type: 'blob',
      comment: zipComment,
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    })
    .then(function (blob) {
      saveAs(blob, zipFilename(player1.value, player2.value))
    })
}

const discordMessage = computed(() => {
  const boPaLabel = boPa.value == 'best-of' ? 'Best of' : 'Play all'
  const scorePreview = showResults.value ? `|| ${leftScore.value} - ${rightScore.value} ||` : 'vs'
  return `${player1.value} ${scorePreview} ${player2.value}
${boPaLabel} ${gamesStore.games.length}
Map draft: ${extractDraftUrl(mapDraft.value)}
Civ draft: ${extractDraftUrl(civDraft.value)}`
})
</script>

<template>
  <Suspense>
    <RecentDrafts
      v-if="mapPresets || civPresets"
      :civ-presets="civPresets"
      :map-presets="mapPresets"
      v-model:map-draft="mapDraft"
      v-model:civ-draft="civDraft"
    />
    <template #fallback>
      <div class="text-center p-4 border-2 col-span-3 mt-4 h-80">Loading Drafts...</div>
    </template>
  </Suspense>
  <GameInfo
    :games="gamesStore.games"
    v-model:player1="player1"
    v-model:player2="player2"
    v-model:map-draft="mapDraft"
    v-model:civ-draft="civDraft"
    :civ-presets="civPresets"
    :map-presets="mapPresets"
    :bo-pa="boPa"
    @update-meta="
      (newErrors: ReplayErrors, newMeta: ReplayMetadata) => {
        if (newMeta?.maps?.pickedMaps?.length) {
          const numOfMaps = newMeta.maps.pickedMaps.length
          if (numOfMaps % 2 == 0) {
            gamesStore.setGamesNumber(numOfMaps - 1)
          } else {
            gamesStore.setGamesNumber(numOfMaps)
          }
        }
        meta = newMeta
        metaErrors = newErrors
      }
    "
  />
  <SetInfo
    :games-count="gamesStore.games.length"
    @set-games="gamesStore.setGamesNumber"
    @set-bo-pa="(newBoPa) => (boPa = newBoPa)"
  />

  <ToggleButton class="mt-4" label="Show results (spoilers)" v-model="showResults" />

  <GameDropzone />
  <GameTable :show-results="showResults" />
  <div id=" message_box" class="mt-4 text-center p-4 border-2 rounded-lg col-span-3 hidden"></div>
  <div class="text-center p-4 border-2 rounded-lg col-span-3 mt-4">
    <ZipPreviewPane :games="gamesStore.games" :player1="player1" :player2="player2" :meta="meta" />
    <button
      :disabled="!downloadEnabled"
      class="btn text-2xl text-white dark:text-black"
      :class="{
        'bg-blue-500': downloadEnabled,
        'bg-blue-200': !downloadEnabled,
        'dark:bg-blue-700': downloadEnabled,
        'dark:bg-blue-300': !downloadEnabled
      }"
      @click="downloadZip"
    >
      Download
    </button>
    <div
      v-if="downloadWarningReplayMissing"
      class="p-2 mt-4 text-sm text-amber-800 rounded-lg bg-amber-100 dark:bg-amber-400 dark:text-amber-800"
    >
      WARNING: You have selected "play all" but not provided all replays.
    </div>
    <div
      v-if="downloadWarningCivDraftMissing"
      class="p-2 mt-4 text-sm text-amber-800 rounded-lg bg-amber-100 dark:bg-amber-400 dark:text-amber-800"
    >
      WARNING: You have not provided a civilization draft link.
    </div>
    <div
      v-if="downloadWarningMapDraftMissing"
      class="p-2 mt-4 text-sm text-amber-800 rounded-lg bg-amber-100 dark:bg-amber-400 dark:text-amber-800"
    >
      WARNING: You have not provided a map draft link.
    </div>
    <div
      v-if="downloadWarningScore"
      class="p-2 mt-4 text-sm text-amber-800 rounded-lg bg-amber-100 dark:bg-amber-400 dark:text-amber-800"
    >
      WARNING: The score does not make sense for a best-of set.
    </div>
  </div>

  <DiscordMessage :discord-message="discordMessage" />
</template>
