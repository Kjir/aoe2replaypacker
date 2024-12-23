import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { parse_rec } from 'aoe2rec-js'
import { mapNames } from '@/entities/maps'
import { civNames } from '@/entities/civs'

export const useGamesStore = defineStore('games', () => {
  const games: Record<string, any> = ref({})
  async function parseGame(file: File) {
    const reader = new FileReader()
    reader.addEventListener(
      'loadend',
      (event) => {
        if (!event.target || !event.target.result) {
          console.log('Could not find target')
          return
        }
        try {
          const rec: any = parse_rec(event.target.result as ArrayBuffer)
          games.value = { ...games.value, [file.name]: rec }
        } catch (error) {
          console.error('Failed to parse')
          console.error(error)
        }
      },
      false
    )
    reader.readAsArrayBuffer(file)
  }

  const gamesInfo = computed(() => {
    return Object.fromEntries(
      Object.entries(games.value).map(([name, info]) => {
        const gs = (info as any).zheader.game_settings
        Object.getOwnPropertyNames(mapNames)
        const map_id = gs.resolved_map_id as number
        const mapName: string =
          mapNames[map_id] ?? gs.rms_strings[1].split(':')[2].replace(/\.rms$/, '')
        const ts = (info as any).zheader.timestamp
        const startDate = new Date(ts * 1000)

        return [
          name,
          {
            date: startDate,
            player1: gs.players[0].name,
            profile1: gs.players[0].profile_id,
            civ1: civNames[gs.players[0].civ_id],
            player2: gs.players[1].name,
            profile2: gs.players[1].profile_id,
            civ2: civNames[gs.players[1].civ_id],
            mapName
          }
        ]
      })
    )
  })
  return { games, parseGame, gamesInfo }
})
