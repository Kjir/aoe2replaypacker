import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { parse_rec } from 'aoe2rec-js'
import { Game, Replay, type ParsedReplay } from '@/entities/game'

export const useGamesStore = defineStore('games', () => {
  const recs: Ref<Record<string, ParsedReplay>> = ref({})
  const games: Ref<Game[]> = ref([])
  const gameCount: Ref<number> = ref(3)

  async function addRec(file: File) {
    const rec = await parseRec(file)
    games.value = games.value.filter((game) => !game.isDummy())

    const game = new Game([new Replay(file, rec)])
    games.value.push(game)
    if (games.value.length > gameCount.value) {
      setGamesNumber(games.value.length)
    } else {
      setGamesNumber(gameCount.value)
    }
  }

  async function parseRec(file: File) {
    return new Promise<ParsedReplay>((resolve) => {
      const reader = new FileReader()
      reader.addEventListener(
        'loadend',
        (event) => {
          if (!event.target || !event.target.result) {
            console.log('Could not find target')
            return
          }
          try {
            const rec: ParsedReplay = parse_rec(event.target.result as ArrayBuffer)
            recs.value = { ...recs.value, [file.name]: rec }
            resolve(rec)
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
    setGamesNumber(gameCount.value)
  }

  function removeGame(index: number) {
    games.value = games.value.filter((_game, game_index) => index != game_index)
    setGamesNumber(gameCount.value - 1)
  }

  function setGamesNumber(gamesNumber: number) {
    gameCount.value = gamesNumber
    games.value = games.value.slice(0, gamesNumber)
    while (games.value.length < gamesNumber) {
      games.value.push(new Game())
    }
  }

  const hasGames = computed(() => Object.values(recs.value).length > 0)
  return { addRec, parseRec, games, hasGames, clearGame, removeGame, setGamesNumber, gameCount }
})
