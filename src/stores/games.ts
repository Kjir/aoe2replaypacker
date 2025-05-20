import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { parse_rec_summary, SavegameSummary } from 'aoe2rec-js'
import { Game, Replay, type DummyReplay } from '@/entities/game'
import webworker from 'libarchive.js/dist/worker-bundle.js?url'

export const useGamesStore = defineStore('games', () => {
  const recordings: Ref<Record<string, SavegameSummary | DummyReplay>> = ref({})
  const games: Ref<Game[]> = ref([new Game(), new Game(), new Game()])

  async function addRec(file: File) {
    const recording = await parseRec(file)
    const gameTypes = Object.groupBy(games.value, (game) => (game.isDummy() ? 'dummy' : 'real'))
    const existingGame = (gameTypes.real ?? []).find((game) => game.matchesRecording(recording))
    if (existingGame) {
      existingGame.addRecording(file, recording)
      return
    }

    const newGame = new Game([new Replay(file, recording)])
    addGame(newGame)
  }

  async function parseRec(file: File) {
    return new Promise<SavegameSummary | DummyReplay>((resolve) => {
      const reader = new FileReader()
      reader.addEventListener(
        'loadend',
        (event) => {
          if (!event.target || !event.target.result) {
            console.error('Could not find target')
            return
          }
          try {
            const recording = parse_rec_summary(event.target.result as ArrayBuffer)
            recordings.value = { ...recordings.value, [file.name]: recording }
            resolve(recording)
          } catch (error) {
            console.error('Failed to parse', error)
            const recording: DummyReplay = { header: { timestamp: file.lastModified }, dummy: true }
            recordings.value = { ...recordings.value, [file.name]: recording }
            resolve(recording)
          }
        },
        false
      )
      reader.readAsArrayBuffer(file)
    })
  }

  function addGame(newGame: Game) {
    const gameTypes = Object.groupBy(games.value, (game) => (game.isDummy() ? 'dummy' : 'real'))

    const realGames = Object.groupBy(gameTypes.real ?? [], (game) =>
      (game.date?.getTime() ?? 0) < (newGame.date?.getTime() ?? 0) ? 'before' : 'after'
    )
    const sortedGames = [...(realGames.before ?? []), newGame, ...(realGames.after ?? [])]

    games.value = [...sortedGames, ...(gameTypes['dummy']?.slice(0, -1) ?? [])]
  }

  function clearGame(index: number) {
    games.value = games.value.filter((_game, game_index) => index != game_index)
    games.value.push(new Game())
  }

  function removeGame(index: number) {
    games.value = games.value.filter((_game, game_index) => index != game_index)
  }

  function setGamesNumber(gamesNumber: number) {
    games.value = games.value.slice(0, gamesNumber)
    while (games.value.length < gamesNumber) {
      games.value.push(new Game())
    }
  }

  function moveGame(index: number, positionShift: number) {
    const otherIndex = index + positionShift
    if (otherIndex < 0 || otherIndex >= realGamesCount.value || otherIndex == index) {
      return
    }
    ;[games.value[index], games.value[otherIndex]] = [games.value[otherIndex], games.value[index]]
  }

  function moveReplay(replayId: number, sourceGame: number, targetGame: number) {
    if (sourceGame >= games.value.length) {
      return
    }

    const replayToMove = games.value[sourceGame].replays.find((replay) => replay.id == replayId)

    if (!replayToMove) {
      return
    }

    games.value = games.value
      .map((game, index) => {
        if (index == sourceGame) {
          return new Game(game.replays.filter((replay) => replay.id != replayId))
        }
        if (index == targetGame) {
          game.addReplay(replayToMove)
        }
        return game
      })
      .toSorted((game1, game2) => +game1.isDummy() - +game2.isDummy())

    if (targetGame == -1) {
      addGame(new Game([replayToMove]))
    }
  }

  async function expandArchive(file: File) {
    const { Archive } = await import('libarchive.js')
    Archive.init({ workerUrl: webworker })
    const archiveData = await Archive.open(file)
    const files: { string: File } = await archiveData.extractFiles()
    Object.values(files)
      .filter((rec) => rec.name.endsWith('.aoe2record'))
      .forEach((rec) => addRec(rec))
  }

  const hasGames = computed(() => Object.values(recordings.value).length > 0)
  const realGamesCount = computed(() => games.value.filter((game) => !game.isDummy()).length)
  return {
    addRec,
    parseRec,
    games,
    hasGames,
    clearGame,
    removeGame,
    setGamesNumber,
    moveGame,
    realGamesCount,
    moveReplay,
    expandArchive
  }
})
