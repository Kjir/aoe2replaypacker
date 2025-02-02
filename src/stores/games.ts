import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { parse_rec } from 'aoe2rec-js'
import { mapNames } from '@/entities/maps'
import { civNames } from '@/entities/civs'

type Replay = {
  zheader: {
    game_settings: {
      resolved_map_id: number
      rms_strings: string[]
      players: {
        name: string
        profile_id: string
        civ_id: number
        color_id: number
      }[]
    }
    timestamp: number
  }
}

export const useGamesStore = defineStore('games', () => {
  const games: Ref<Record<string, Replay>> = ref({})
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
          const rec: Replay = parse_rec(event.target.result as ArrayBuffer)
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

  function removeGame(name: string) {
    games.value = Object.fromEntries(Object.entries(games.value).filter(([file_name, _rec]) => file_name != name));
  }

  const gamesInfo = computed(() => {
    return Object.fromEntries(
      Object.entries(games.value).map(([name, info]) => {
        const game_settings = info.zheader.game_settings
        const map_id = game_settings.resolved_map_id
        const mapName: string = mapNames[map_id] ?? game_settings.rms_strings[1].split(':')[2].replace(/\.rms$/, '')
        const startDate = new Date(info.zheader.timestamp * 1000)

        const players = game_settings.players;

        return [
          name,
          {
            name,
            date: startDate,
            player1: players[0].name,
            profile1: players[0].profile_id,
            civ1: civNames[players[0].civ_id],
            color1: players[0].color_id + 1,
            player2: players[1].name,
            profile2: players[1].profile_id,
            civ2: civNames[players[1].civ_id],
            color2: players[1].color_id + 1,
            mapName
          }
        ]
      })
    )
  })

  const hasGames = computed(() => Object.values(games.value).length > 0);
  return { games, parseGame, gamesInfo, hasGames, removeGame }
})
