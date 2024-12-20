import unidecode from 'unidecode'
import { logn, toBase26 } from '../lib/maths'

let gameCounter = 0
let replayCounter = 0

export class Game {
  replays: Replay[] = []
  winner: 'left' | 'none' | 'right'
  id: number

  constructor() {
    this.id = gameCounter++
    this.winner = 'none'
    this.replays = [new Replay()]
  }
}

export class Replay {
  id: number
  file: File | null
  constructor() {
    this.id = replayCounter++
    this.file = null
  }
}

export function normalizePlayerName(playerName: string, defaultName: string) {
  const asciiName = unidecode(playerName)
  const noWhitespaceName = asciiName.replace(/\s/g, '')
  // eslint-disable-next-line no-control-regex
  const noUnprintableName = noWhitespaceName.replace(/[\x00-\x20]/g, '')
  const normalizedName = noUnprintableName.replace(/[<>:"/\\|?*]/g, '')

  if (normalizedName.length == 0) {
    return defaultName
  } else {
    return normalizedName
  }
}

export function matchName(player1: string, player2: string) {
  return `${normalizePlayerName(player1, 'Player1')}_vs_${normalizePlayerName(player2, 'Player2')}`
}

export function zipFilename(player1: string, player2: string) {
  return `${matchName(normalizePlayerName(player1, 'Player1'), normalizePlayerName(player2, 'Player2'))}.zip`
}

export function computeReplayFilename(
  player1: string,
  player2: string,
  game: Game,
  gameIdx: number,
  replayIdx: number
) {
  const numReplays = game.replays.length
  const replaySubNumbering =
    numReplays > 1 ? toBase26(replayIdx, Math.ceil(logn(numReplays, 26))) : ''
  return `${matchName(normalizePlayerName(player1, 'Player1'), normalizePlayerName(player2, 'Player2'))}_G${gameIdx + 1}${replaySubNumbering}.aoe2record`
}

export function computeReplayFilenamePreview(
  player1: string,
  player2: string,
  game: Game,
  gameIdx: number,
  replay: Replay,
  replayIdx: number
) {
  const filename = computeReplayFilename(
    normalizePlayerName(player1, 'Player1'),
    normalizePlayerName(player2, 'Player2'),
    game,
    gameIdx,
    replayIdx
  )
  const dummyIndicator = replay.file ? '' : ' (dummy file)'

  return `${filename}${dummyIndicator}`
}
