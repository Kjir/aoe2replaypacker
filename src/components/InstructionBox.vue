<template>
  <div class="p-4 border-2 rounded-lg col-span-3 mb-4">
    <h1 class="text-3xl text-center">AoE2 Replay Pack Generator</h1>
    <p>
      This page will help you create a zip file of replays for submitting your match results. To use
      it follow, these simple steps:
    </p>
    <ol class="mt-2 list-decimal list-inside">
      <li>Fill in the player names</li>
      <li>
        For each replay, click the "choose file" button and navigate to your replay
        <ol class="list-decimal list-inside ml-4" type="a">
          <li>Go to "%USERPROFILE%\Games\Age of Empires 2 DE"</li>
          <li>Click the folder with a bunch of numbers</li>
          <li>Go to the "savegame" folder</li>
        </ol>
      </li>
      <li>Once all replays are selected, click download</li>
    </ol>
    <p class="mt-2">
      Note: if the match ended 2-0, simply leave the third file empty and a dummy file will
      automatically be generated and used
    </p>
    <p class="mt-2">
      Technical note: All of this is done in your browser, no data is uploaded anywhere.
    </p>
  </div>
</template>
