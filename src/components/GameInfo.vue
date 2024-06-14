<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { Game } from '../entities/game'
import debounce from 'lodash.debounce'

const props = defineProps<{
  games: Game[]
}>()

const player1 = defineModel('player1')
const player2 = defineModel('player2')
const emit = defineEmits<{
  (e: 'update-meta', value: object): void
}>()

const maps = ref()
const civs = ref()
const meta: Ref<{
  maps: { draft?: string; preset?: string; host?: string; guest?: string; admin_map?: string }
  civs: { draft?: string; preset?: string; host?: string; guest?: string }
}> = ref({ maps: {}, civs: {} })

const mapPresets = {
  BNdEh: 3,
  EbPGx: 5
}

const civPresets = {
  IwarA: 3,
  NurUH: 5
}

const errors: Ref<{
  maps: string | null
  civs: string | null
}> = ref({
  maps: null,
  civs: null
})

const extractDraftId = (url: string) => {
  return url.replace(/https:\/\/aoe2cm\.net\/(draft|spectate)\//, '').replace(/\/$/, '')
}

const debouncedFetchMaps = debounce(async () => {
  const draftId = extractDraftId(maps.value)
  errors.value.maps = null
  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  const json = await response.json()
  if (!(json.preset.presetId in mapPresets)) {
    errors.value.maps = `The draft is not a map draft from a valid TCC map preset (${json.preset.presetId})`
  }
  meta.value.maps = {
    draft: draftId,
    preset: json.preset.presetId,
    host: json.nameHost,
    guest: json.nameGuest,
    admin_map: json.events.slice(-1)[0].chosenOptionId.replaceAll('-', ' ')
  }
  emit('update-meta', meta.value)
}, 300)

const debouncedFetchCivs = debounce(async () => {
  const draftId = extractDraftId(civs.value)
  errors.value.civs = null
  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  const json = await response.json()
  if (!(json.preset.presetId in civPresets)) {
    errors.value.civs = `The draft is not a civ draft from a valid TCC civ preset (${json.preset.presetId})`
  }
  meta.value.civs = {
    draft: draftId,
    preset: json.preset.presetId,
    host: json.nameHost,
    guest: json.nameGuest
  }
  emit('update-meta', meta.value)
}, 300)

watch(maps, debouncedFetchMaps)
watch(civs, debouncedFetchCivs)
</script>

<template>
  <div class="text-center p-4 border-2 col-span-3 mt-4">
    <h2 class="text-center text-2xl">Game Info</h2>
    <div>Best of {{ props.games.length }}</div>
    <input
      placeholder="Player 1 Name"
      class="border-1 bg-gray-100 p-2 rounded"
      type="text"
      v-model="player1"
    /><span class="mx-10">vs</span>
    <input
      placeholder="Player 2 Name"
      class="border-1 bg-gray-100 p-2 rounded"
      type="text"
      v-model="player2"
    />
    <h3 class="text-center text-xl mt-4">Drafts</h3>
    <div class="mb-6">
      <label class="text-gray-700 text-sm font-bold mb-2" for="maps">
        Maps Draft (ID or URL)
      </label>
      <input
        class="border-1 bg-gray-100 p-2 rounded"
        id="maps"
        type="text"
        placeholder="e.g. XZedf"
        v-model="maps"
      />
      <p v-if="errors.maps" class="text-red-500 text-xs italic">{{ errors.maps }}</p>
      <p v-if="meta.maps.host">{{ meta.maps.host }} vs {{ meta.maps.guest }}</p>
      <p v-if="meta.maps.admin_map">Admin pick: {{ meta.maps.admin_map }}</p>
    </div>
    <div class="mb-6">
      <label class="text-gray-700 text-sm font-bold mb-2" for="civs">
        Civs Draft (ID or URL)
      </label>
      <input
        class="border-1 bg-gray-100 p-2 rounded"
        id="civs"
        type="text"
        placeholder="e.g. vbvIP"
        v-model="civs"
      />
      <p v-if="errors.civs" class="text-red-500 text-xs italic">{{ errors.civs }}</p>
      <p v-if="meta.civs.host">{{ meta.civs.host }} vs {{ meta.civs.guest }}</p>
    </div>
  </div>
</template>
