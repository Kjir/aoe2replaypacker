<script setup lang="ts">
import { format, formatDistanceToNow, intlFormat } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import GameReorder from '@/components/GameReorder.vue'
import GameToolbox from '@/components/GameToolbox.vue'
import type { Game } from '@/entities/game'
import GameTeam from '@/components/GameTeam.vue'
import ExpandButton from '@/components/ExpandButton.vue'
import winner from '@/assets/crown.svg'
import loser from '@/assets/skull.svg'
import { computed, ref } from 'vue'
import { readableSize } from '@/lib/maths'

const props = defineProps<{
  index: number
  numGames: number
  game: Game
}>()

const emit = defineEmits<{
  setWinner: [winner: 'left' | 'none' | 'right']
  move: [direction: 'up' | 'down']
}>()

const leftName = computed(() => props.game.teams?.[0]?.players?.[0]?.name)
const rightName = computed(() => {
  if (typeof props.game.teams == 'undefined') {
    return ''
  }
  const teamsCount = props.game.teams.length
  return props.game.teams[teamsCount - 1]?.players?.[0]?.name
})

const isUnparseable = computed(
  () =>
    !props.game.mapName &&
    props.game.replays.length > 0 &&
    props.game.replays.every((replay) => !replay.recording.success)
)

const replayExpandText = computed(
  () => `${props.game.replays.length} replay${props.game.replays.length > 1 ? 's' : ''}`
)
const showReplays = ref<boolean>(false)
</script>
<template>
  <div>
    <GameReorder
      class="absolute left-0 top-0"
      :top="props.index == 0"
      :bottom="props.index + 1 == props.numGames"
      @move="(direction: 'up' | 'down') => emit('move', direction)"
    />
    <GameToolbox class="absolute right-0 top-1" :game-index="props.index" />
    <h3 class="text-center text-2xl">Game {{ props.index + 1 }}</h3>
    <h4 class="text-center text-lg text-yellow-500 dark:text-yellow-200" v-if="isUnparseable">
      Unparseable game
    </h4>
    <h4 class="text-center text-lg">{{ props.game.mapName }}</h4>
    <p v-if="props.game.date" class="text-center text-sm text-gray-500 dark:text-gray-400">
      Played
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
      and lasted {{ format(new UTCDate(props.game.duration), 'HH:mm:ss') }}
    </p>
    <p
      v-if="props.game.replays.length > 1"
      class="text-center text-sm text-gray-500 dark:text-gray-400"
    >
      Game was restored {{ props.game.replays.length - 1 }} time{{
        props.game.replays.length > 2 ? 's' : ''
      }}
    </p>
    <div class="flex mt-6 pl-6 pr-6">
      <div class="inline-flex w-1/2 h-full">
        <input
          type="radio"
          :id="`winner-${props.game.id}`"
          :name="`winlose-${props.game.id}`"
          class="peer hidden"
          @change="emit('setWinner', 'left')"
          :checked="props.game.winner == 'left'"
          :value="'left'"
        />
        <label
          :for="`winner-${props.game.id}`"
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
          :id="`loser-${props.game.id}`"
          :name="`winlose-${props.game.id}`"
          class="peer hidden"
          @change="emit('setWinner', 'right')"
          :checked="props.game.winner == 'right'"
          :value="'right'"
        />
        <label
          :for="`loser-${props.game.id}`"
          class="inline-flex items-center justify-center w-full p-2 bg-white border-l border-r-2 border-y-2 rounded-r-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
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
    <div v-if="isUnparseable" class="w-full mt-4">
      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        This recording <strong>could not be parsed</strong> by the replay packer.
      </p>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400">
        Please check that you have selected the <strong>correct file</strong>. Consider
        <a class="underline" href="https://forms.gle/NDKqE8acLdYR2JrKA" target="_blank"
          >reporting an issue</a
        >.
      </p>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
        The uploaded file will still be included in the downloaded Zip. You can proceed with the
        submission of your results regardless of this issue.
      </p>
    </div>
    <div v-else class="w-full grid grid-cols-2 gap-12 justify-items-between mt-4 mb-12 pl-6 pr-6">
      <GameTeam
        v-for="(team, index) in props.game.teams"
        :key="team.id"
        :team="team"
        :position="index % 2 ? 'right' : 'left'"
      />
    </div>
    <div class="flex justify-end">
      <div class="flex flex-col content-end">
        <span class="flex justify-end">
          <expand-button
            :open-text="replayExpandText"
            :close-text="replayExpandText"
            @click="showReplays = !showReplays"
          />
        </span>
        <ul
          :class="showReplays ? ['max-h-screen'] : ['max-h-0']"
          class="mt-2 transition-max-height overflow-hidden duration-500"
        >
          <li v-for="replay in props.game.replays" :key="replay.id">
            {{ replay.file.name }} ({{ readableSize(replay.file.size) }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
