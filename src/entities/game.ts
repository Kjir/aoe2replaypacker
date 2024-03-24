let gameCounter = 0
let replayCounter = 0

export class Game {
  replays: Replay[] = []
  id: number

  constructor() {
    this.id = gameCounter++
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

function matchName(player1: string, player2: string) {
  return `${player1}_vs_${player2}`
}

export function zipFilename(player1: string, player2: string) {
  return `${matchName(player1, player2)}.zip`
}

function toBase26(value: number) {
  let res = ''
  value = Math.round(value)
  do {
    const digit = value % 26
    value = Math.round(value / 26)
    res += String.fromCharCode(0x61 + digit)
  } while (value > 0)
  return res
}

export function computeReplayFilename(
  player1: string,
  player2: string,
  game: Game,
  gameIdx: number,
  replayIdx: number
) {
  const replaySubNumbering = game.replays.length > 1 ? toBase26(replayIdx) : ''
  return `${matchName(player1, player2)}_G${gameIdx + 1}${replaySubNumbering}.aoe2record`
}

export function computeReplayFilenamePreview(
  player1: string,
  player2: string,
  game: Game,
  gameIdx: number,
  replay: Replay,
  replayIdx: number
) {
  const filename = computeReplayFilename(player1, player2, game, gameIdx, replayIdx)
  const dummyIndicator = replay.file ? '' : ' (dummy file)'

  return `${filename}${dummyIndicator}`
}
