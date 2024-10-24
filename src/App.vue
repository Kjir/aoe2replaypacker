<script setup lang="ts">
import InstructionBox from './components/InstructionBox.vue'
import ReplayForm from './components/ReplayForm.vue'

const urlParams = new URLSearchParams(window.location.search)
const civDraftPresets = urlParams.get('civpresets')?.split(',') || null
const mapDraftPresets = urlParams.get('mappresets')?.split(',') || null
</script>

<template>
  <div class="lg:container lg:mx-auto lg:max-w-screen-lg">
    <main class="mt-10">
      <InstructionBox />
      <ReplayForm :civ-presets="civDraftPresets" :map-presets="mapDraftPresets" />
    </main>
    <footer>
      <div class="text-center p-4 border-2 col-span-3 mt-4">
        <p>
          Created by <a class="underline" href="https://github.com/ZetaTwo">ZetaTwo</a> &amp;
          <a class="underline" href="https://github.com/Kjir">Beargwyn</a> -
          <a class="underline" href="https://github.com/ZetaTwo/aoe2replaypacker">Source code</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
