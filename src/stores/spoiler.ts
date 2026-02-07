import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import webworker from 'libarchive.js/dist/worker-bundle.js?url'

export const useSpoilerStore = defineStore('spoiler', () => {
  const recordings: Ref<File[]> = ref([])

  async function clearRecordings() {
    recordings.value = []
  }

  async function addRecording(file: File) {
    recordings.value.push(file)
  }

  async function expandArchive(file: File) {
    const { Archive } = await import('libarchive.js')
    Archive.init({ workerUrl: webworker })
    const archiveData = await Archive.open(file)
    const files: { string: File } = await archiveData.extractFiles()
    Object.values(files)
      .filter((rec) => rec.name.endsWith('.aoe2record'))
      .forEach((rec) => addRecording(rec))
  }

  return {
    recordings,
    addRecording,
    clearRecordings,
    expandArchive
  }
})
