<script setup lang="ts">
import InstructionBox from '@/components/InstructionBox.vue'
import ReplayForm from '@/components/ReplayForm.vue'
import tournamentsData from 'virtual:tournaments-data'

function getPresets(params: URLSearchParams): [string[] | null, string[] | null] {
  const civDraftPresets = params.get('civpresets')?.split(',') || []
  const mapDraftPresets = params.get('mappresets')?.split(',') || []
  const tournamentId = params.get('tournament')
  if (tournamentId) {
    const tournament = tournamentsData[tournamentId]
    if (tournament) {
      civDraftPresets?.push(...tournament.civs)
      mapDraftPresets?.push(...tournament.maps)
    }
  }
  return [
    civDraftPresets.length > 0 ? civDraftPresets : null,
    mapDraftPresets.length > 0 ? mapDraftPresets : null
  ]
}

const urlParams = new URLSearchParams(window.location.search)
const [civDraftPresets, mapDraftPresets] = getPresets(urlParams)
</script>

<template>
  <div class="lg:container lg:mx-auto lg:max-w-screen-lg">
    <main class="mt-10">
      <InstructionBox />
      <ReplayForm :civ-presets="civDraftPresets" :map-presets="mapDraftPresets" />
    </main>
    <footer>
      <div class="text-center p-4 border-2 rounded-lg col-span-3 mt-4">
        <p>
          Created by <a class="underline" href="https://github.com/ZetaTwo">ZetaTwo</a> &amp;
          <a class="underline" href="https://github.com/Kjir">Beargwyn</a> -
          <a class="underline" href="https://github.com/ZetaTwo/aoe2replaypacker">Source code</a> -
          <a class="underline" href="https://forms.gle/NDKqE8acLdYR2JrKA">Report an issue</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
