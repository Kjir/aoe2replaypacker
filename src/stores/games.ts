import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { parse_rec } from 'aoe2rec-js'
import { Game, Replay, type ParsedReplay } from '@/entities/game'

export const useGamesStore = defineStore('games', () => {
  const recordings: Ref<Record<string, ParsedReplay>> = ref({})
  const games: Ref<Game[]> = ref([])

  async function addRec(file: File) {
    const recording = await parseRec(file)
    const gameTypes = Object.groupBy(games.value, (game) => (game.isDummy() ? 'dummy' : 'real'))

    const newGame = new Game([new Replay(file, recording)])
    const realGames = [...(gameTypes['real'] || []), newGame]
    const sortedGames = realGames.sort(
      (game1, game2) => (game1?.date?.getTime() ?? 0) - (game2?.date?.getTime() ?? 0)
    )

    games.value = [...sortedGames, ...(gameTypes['dummy']?.slice(0, -1) || [])]
    setGamesNumber(games.value.length)
  }

  async function parseRec(file: File) {
    return new Promise<ParsedReplay>((resolve) => {
      const reader = new FileReader()
      reader.addEventListener(
        'loadend',
        (event) => {
          if (!event.target || !event.target.result) {
            console.error('Could not find target')
            return
          }
          try {
            const recording: ParsedReplay = parse_rec(event.target.result as ArrayBuffer)
            recordings.value = { ...recordings.value, [file.name]: recording }
            resolve(recording)
          } catch (error) {
            console.error('Failed to parse')
            console.error(error)
            resolve({} as ParsedReplay)
          }
        },
        false
      )
      reader.readAsArrayBuffer(file)
    })
  }

  function clearGame(index: number) {
    games.value = games.value.filter((_game, game_index) => index != game_index)
    games.value.push(new Game())
  }

  function removeGame(index: number) {
    games.value = games.value.filter((_game, game_index) => index != game_index)
    setGamesNumber(games.value.length)
  }

  function setGamesNumber(gamesNumber: number) {
    games.value = games.value.slice(0, gamesNumber)
    while (games.value.length < gamesNumber) {
      games.value.push(new Game())
    }
  }

  const hasGames = computed(() => Object.values(recordings.value).length > 0)
  return { addRec, parseRec, games, hasGames, clearGame, removeGame, setGamesNumber }
})
