<script setup lang="ts">
const emit = defineEmits<{
  setGames: [number]
}>()
const props = defineProps<{
  gamesCount: number
}>()
</script>
<template>
  <div class="mt-4 text-center">
    <ul class="grid w-full gap-6 md:grid-cols-5">
      <li>
        <input
          type="radio"
          id="bo3"
          name="bo"
          value="3"
          class="hidden peer"
          required
          :checked="props.gamesCount == 3"
          @change="emit('setGames', 3)"
        />
        <label
          for="bo3"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of 3</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="bo5"
          name="bo"
          value="5"
          class="hidden peer"
          :checked="props.gamesCount == 5"
          @change="emit('setGames', 5)"
        />
        <label
          for="bo5"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of 5</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="bo7"
          name="bo"
          value="7"
          class="hidden peer"
          :checked="props.gamesCount == 7"
          @change="emit('setGames', 7)"
        />
        <label
          for="bo7"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of 7</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="bo9"
          name="bo"
          value="9"
          class="hidden peer"
          :checked="props.gamesCount == 9"
          @change="emit('setGames', 9)"
        />
        <label
          for="bo9"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of 9</div>
          </div>
        </label>
      </li>
      <li>
        <input
          type="radio"
          id="bo11"
          name="bo"
          value="11"
          class="hidden peer"
          :checked="props.gamesCount == 11"
          @change="emit('setGames', 11)"
        />
        <label
          for="bo11"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of 11</div>
          </div>
        </label>
      </li>
    </ul>
  </div>
</template>
