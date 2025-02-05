<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <div class="p-4 border-2 rounded-lg col-span-3 mb-4">
    <h1 class="text-3xl text-center">AoE2 Replay Pack Generator</h1>
    <p>
      This page will help you create a zip file of replays for submitting your AoE2 match results.
    </p>
    <button
      @click="toggleOpen()"
      class="mt-2 border-2 px-1 py-1 rounded-lg cursor-pointer text-gray-500 bg-white dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <template v-if="open">Hide Help</template><template v-else>Show Help</template>
    </button>
    <div
      :class="{ 'max-h-0': !open, 'max-h-screen': open }"
      class="mt-2 transition-max-height overflow-hidden duration-1000"
    >
      <p>To use it follow, these simple steps:</p>
      <ol class="mt-2 list-decimal list-inside">
        <li>Fill in the player names</li>
        <li>If applicable, fill out map and civ drafts</li>
        <li>
          Add replays by clicking the add replay button and navigating to the replay directory
          <ol class="list-decimal list-inside ml-4" type="a">
            <li>Go to "%USERPROFILE%\Games\Age of Empires 2 DE"</li>
            <li>Click the folder with a bunch of numbers</li>
            <li>Go to the "savegame" folder</li>
          </ol>
        </li>
        <li>For each game, check that the game info is correct and select the correct winner</li>
        <li>
          Now you can download the zip file with your replays as well as copy the Discord message
          template for easy reporting of the results
        </li>
      </ol>
      <p class="mt-2">
        Note: You only need to select actual game replays. The tool will add automatically generate
        dummy files as needed.
      </p>
      <p class="mt-2">
        Technical note: All of this is done in your browser, no data is uploaded anywhere.
      </p>
    </div>
  </div>
</template>
