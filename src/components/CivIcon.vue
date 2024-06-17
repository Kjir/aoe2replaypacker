<script setup lang="ts">
const civs: Record<string, string> = {
  armenians: 'armenians',
  aztecs: 'aztecs',
  bengalis: 'bengalis',
  berbers: 'berber',
  bohemians: 'bohemians',
  britons: 'britons',
  bulgarians: 'bulgarians',
  burgundians: 'burgundians',
  burmese: 'burmese',
  byzantines: 'byzantines',
  celts: 'celts',
  chinese: 'chinese',
  cumans: 'cumans',
  dravidians: 'dravidians',
  ethiopians: 'ethiopians',
  franks: 'franks',
  georgians: 'georgians',
  goths: 'goths',
  gurjaras: 'gurjaras',
  huns: 'huns',
  inca: 'inca',
  indians: 'indians',
  italians: 'italians',
  japanese: 'japanese',
  khmer: 'khmer',
  koreans: 'koreans',
  lithuanians: 'lithuanians',
  magyars: 'magyars',
  malay: 'malay',
  malians: 'malians',
  mayans: 'mayans',
  mongols: 'mongols',
  persians: 'persians',
  poles: 'poles',
  portuguese: 'portuguese',
  romans: 'romans',
  saracens: 'saracens',
  sicilians: 'sicilians',
  slavs: 'slavs',
  spanish: 'spanish',
  tatars: 'tatars',
  teutons: 'teutons',
  turks: 'turks',
  vietnamese: 'vietnamese',
  vikings: 'vikings'
}

const civIcons = import.meta.glob('../assets/civs/*.png', {
  query: { w: 26, h: 26, format: 'webp' },
  import: 'default',
  eager: true
}) as Record<string, string>

const props = defineProps<{
  civ: string
}>()
const iconName = civs[props.civ]

const icon = civIcons[`../assets/civs/menu_techtree_${iconName}.png`]
</script>

<template>
  <img class="inline" :src="icon" :alt="props.civ" />
</template>
