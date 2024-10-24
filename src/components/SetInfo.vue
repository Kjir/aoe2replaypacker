<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  setGames: [number]
}>()
const props = defineProps<{
  gamesCount: number
}>()
const customGameCount = ref(11)
const bestOf = ref<number | 'custom'>(props.gamesCount)
watch(customGameCount, async (newCount, oldCount) => {
  if (newCount == oldCount) {
    return
  }
  if (newCount < 0) {
    customGameCount.value = 0
    return
  }
  if (newCount > 99) {
    customGameCount.value = 99
    return
  }
  if (bestOf.value != 'custom') {
    return
  }
  emit('setGames', newCount)
})
watch(bestOf, (newBestOf, oldBestOf) => {
  if (newBestOf == oldBestOf) {
    return
  }
  if (newBestOf == 'custom') {
    emit('setGames', customGameCount.value)
  } else {
    emit('setGames', newBestOf)
  }
})
</script>
<template>
  <div class="mt-4 text-center">
    <ul class="grid w-full gap-6 md:grid-cols-5">
      <li v-for="count in [3, 5, 7, 9]" :key="count" :value="count">
        <input
          type="radio"
          :id="`bo${count}`"
          name="bo"
          v-model="bestOf"
          :value="count"
          class="hidden peer"
          required
          :checked="bestOf != 'custom' && props.gamesCount == count"
        />
        <label
          :for="`bo${count}`"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">Best of {{ count }}</div>
          </div>
        </label>
      </li>

      <li>
        <input
          type="radio"
          id="bo11"
          name="bo"
          v-model="bestOf"
          value="custom"
          class="hidden peer"
          :checked="bestOf == 'custom'"
        />
        <label
          for="bo11"
          class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <div class="block">
            <div class="w-full text-lg font-semibold">
              Best of
              <input
                class="p-0 w-8 bg-transparent border text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                style="-moz-appearance: textfield"
                type="number"
                aria-roledescription="Number field"
                v-model="customGameCount"
                value="11"
                data-hs-input-number-input=""
                min="1"
                max="99"
                maxlength="2"
              />
            </div>
          </div>
        </label>
      </li>
    </ul>
  </div>
</template>
