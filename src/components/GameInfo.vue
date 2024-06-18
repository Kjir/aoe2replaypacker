<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { Game } from '../entities/game'
import type { Aoe2CmEvent, Aoe2CmDraftOption } from '../entities/aoe2cm'
import type { ReplayMetadata } from '../entities/gamemeta'
import debounce from 'lodash.debounce'
import CivIcon from './CivIcon.vue'

const props = defineProps<{
  games: Game[]
}>()

const player1 = defineModel('player1')
const player2 = defineModel('player2')
const emit = defineEmits<{
  updateMeta: [ReplayMetadata]
}>()

const mapsDraftURI = ref()
const civDraftURI = ref()
const meta: Ref<ReplayMetadata> = ref({ maps: null, civs: null })

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
    emit('updateMeta', meta.value)
    return
  }

  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  if (!response.ok) {
    errors.value.maps = `Map draft not found, ID/URL invalid`
    emit('updateMeta', meta.value)
    return
  }
  const json = await response.json()
  if ('encodedCivilisations' in json.preset) {
    errors.value.maps = 'This does not seem to be a map draft'
    return
  }
  if (!(json.preset.presetId in mapPresets)) {
    errors.value.maps = `The draft is not a map draft from a valid TCC map preset (${json.preset.presetId})`
  }

  const availableMaps = (Object.values(json.preset.draftOptions) as [Aoe2CmDraftOption]).reduce(
    (map, draftMap) => {
      map[draftMap.id] = { name: draftMap.name, image: draftMap.imageUrls.emblem }
      return map
    },
    {} as Record<string, { name: string; image: string }>
  )

  const picks = json.events.filter((event: Aoe2CmEvent) => event.actionType == 'pick')
  const pickedMaps = picks.map((event: Aoe2CmEvent) => event.chosenOptionId)

  meta.value.maps = {
    draft: draftId,
    preset: json.preset.presetId,
    host: json.nameHost,
    guest: json.nameGuest,
    availableMaps: availableMaps,
    pickedMaps: pickedMaps
  }
  emit('updateMeta', meta.value)
}, 300)

const debouncedFetchCivs = debounce(async () => {
  meta.value.civs = null
  errors.value.civs = null

  const draftId = extractDraftId(civDraftURI.value)
  if (draftId.length <= 0) {
    emit('updateMeta', meta.value)
    return
  }

  const response = await fetch(`https://aoe2cm.net/api/draft/${draftId}`)
  if (!response.ok) {
    errors.value.civs = `Civ draft not found, ID/URL invalid`
    emit('updateMeta', meta.value)
    return
  }

  const json = await response.json()
  if (!('encodedCivilisations' in json.preset)) {
    errors.value.civs = 'This does not seem to be a civ draft'
    return
  }
  if (!(json.preset.presetId in civPresets)) {
    errors.value.civs = `The draft is not a civ draft from a valid TCC civ preset (${json.preset.presetId})`
  }

  const picks = json.events.filter((event: Aoe2CmEvent) => event.actionType == 'pick')
  const pickedCivsHost = picks
    .filter((event: Aoe2CmEvent) => event.player == 'HOST')
    .map((event: Aoe2CmEvent) => event.chosenOptionId)
  const pickedCivsGuest = picks
    .filter((event: Aoe2CmEvent) => event.player == 'GUEST')
    .map((event: Aoe2CmEvent) => event.chosenOptionId)

  meta.value.civs = {
    draft: draftId,
    preset: json.preset.presetId,
    host: json.nameHost,
    guest: json.nameGuest,
    hostCivs: pickedCivsHost,
    guestCivs: pickedCivsGuest
  }
  emit('updateMeta', meta.value)
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
    <h3 class="text-center text-xl mt-4">Drafts (optional)</h3>
    <p class="text-center">Input aoe2cm.net civ/map draft ID/URL.</p>
    <div class="grid grid-cols-2">
      <div class="mb-6">
        <label class="text-gray-700 text-sm font-bold mb-2" for="maps"> Map draft</label>
        <input
          class="border-1 bg-gray-100 p-2 rounded ml-2"
          id="maps"
          type="text"
          placeholder="e.g. XZedf"
          v-model="mapsDraftURI"
        />
        <p v-if="errors.maps" class="text-red-500 text-xs italic">{{ errors.maps }}</p>
        <div class="text-left px-8 pt-4" v-if="meta.maps">
          <p class="text-center">{{ meta.maps.host }} vs {{ meta.maps.guest }}</p>
          <ul class="pl-8 text-center">
            <li v-for="(map, mapIdx) in meta.maps.pickedMaps" :key="mapIdx">
              <div>
                <img
                  class="mx-auto"
                  :src="'https://aoe2cm.net/' + meta.maps.availableMaps[map].image"
                  :alt="meta.maps.availableMaps[map].name"
                />
              </div>
              <div>
                {{ meta.maps.availableMaps[map].name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="mb-6">
        <label class="text-gray-700 text-sm font-bold mb-2" for="civs"> Civ draft</label>
        <input
          class="border-1 bg-gray-100 p-2 rounded ml-2"
          id="civs"
          type="text"
          placeholder="e.g. vbvIP"
          v-model="civDraftURI"
        />
        <p v-if="errors.civs" class="text-red-500 text-xs italic">{{ errors.civs }}</p>
        <div v-if="meta.civs" class="text-left px-8 pt-4">
          <p>{{ meta.civs.host }} vs {{ meta.civs.guest }}</p>
          <ul class="pl-8">
            <li class="capitalize mt-2" v-for="(civ, civIdx) in meta.civs.hostCivs" :key="civIdx">
              <CivIcon :civ="civ.toLowerCase()" />
              {{ civ }}
            </li>
          </ul>
          <p class="pl-20">vs</p>
          <ul class="pl-8">
            <li class="capitalize mt-2" v-for="(civ, civIdx) in meta.civs.guestCivs" :key="civIdx">
              <CivIcon :civ="civ.toLowerCase()" />
              {{ civ }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
