<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { Game } from '../entities/game'
import type { Aoe2CmEvent } from '../entities/aoe2cm'
import type { MapDraft, CivDraft } from '../entities/gamemeta'
import debounce from 'lodash.debounce'

const props = defineProps<{
  games: Game[]
}>()

const player1 = defineModel('player1')
const player2 = defineModel('player2')
const emit = defineEmits<{
  (e: 'update-meta', value: object): void
}>()

const mapsDraftURI = ref()
const civDraftURI = ref()
const meta: Ref<{
  maps: MapDraft | null
  civs: CivDraft | null
}> = ref({ maps: null, civs: null })

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
  meta.value.maps = null
  errors.value.maps = null
  const draftId = extractDraftId(mapsDraftURI.value)

  if (draftId.length <= 0) {
    emit('update-meta', meta.value)
    return
  }

  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  if (!response.ok) {
    errors.value.maps = `Map draft not found, ID/URL invalid`
    emit('update-meta', meta.value)
    return
  }
  const json = await response.json()
  if (!(json.preset.presetId in mapPresets)) {
    errors.value.maps = `The draft is not a map draft from a valid TCC map preset (${json.preset.presetId})`
  }

  const picks = json.events.filter((event: Aoe2CmEvent) => event.actionType == 'pick')
  const pickedMaps = picks.map((event: Aoe2CmEvent) => event.chosenOptionId.replace('-', ' '))

  meta.value.maps = {
    draft: draftId,
    preset: json.preset.presetId,
    host: json.nameHost,
    guest: json.nameGuest,
    maps: pickedMaps
  }
  emit('update-meta', meta.value)
}, 300)

const debouncedFetchCivs = debounce(async () => {
  meta.value.civs = null
  errors.value.civs = null

  const draftId = extractDraftId(civDraftURI.value)
  if (draftId.length <= 0) {
    emit('update-meta', meta.value)
    return
  }

  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  if (!response.ok) {
    errors.value.civs = `Civ draft not found, ID/URL invalid`
    emit('update-meta', meta.value)
    return
  }
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

watch(mapsDraftURI, debouncedFetchMaps)
watch(civDraftURI, debouncedFetchCivs)
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
    <p>Input aoe2cm.net civ/map draft ID/URL (optional).</p>
    <div class="mb-6">
      <label class="text-gray-700 text-sm font-bold mb-2" for="maps"> Maps Draft </label>
      <input
        class="border-1 bg-gray-100 p-2 rounded"
        id="maps"
        type="text"
        placeholder="e.g. XZedf"
        v-model="mapsDraftURI"
      />
      <p v-if="errors.maps" class="text-red-500 text-xs italic">{{ errors.maps }}</p>
      <div v-if="meta.maps">
        <p>{{ meta.maps.host }} vs {{ meta.maps.guest }}</p>
        <p>Maps:</p>
        <ul>
          <li class="capitalize" v-for="(map, mapIdx) in meta.maps.maps" :key="mapIdx">
            {{ map }}
          </li>
        </ul>
      </div>
    </div>
    <div class="mb-6">
      <label class="text-gray-700 text-sm font-bold mb-2" for="civs"> Civs Draft </label>
      <input
        class="border-1 bg-gray-100 p-2 rounded"
        id="civs"
        type="text"
        placeholder="e.g. vbvIP"
        v-model="civDraftURI"
      />
      <p v-if="errors.civs" class="text-red-500 text-xs italic">{{ errors.civs }}</p>
      <p v-if="meta.civs">{{ meta.civs.host }} vs {{ meta.civs.guest }}</p>
    </div>
  </div>
</template>
