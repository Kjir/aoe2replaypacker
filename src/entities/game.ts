import unidecode from 'unidecode'
import { logn, toBase26 } from '../lib/maths'
import { mapNames } from './maps'
import { civNames } from './civs'

const UNICODE_NORMALIZATION = false // Setting this to true doubles the code size

let gameCounter = 0
let replayCounter = 0

export class Game {
  replays: Replay[] = []
  winner: 'left' | 'none' | 'right'
  id: number
  date?: Date
  mapName?: string
  player1?: string
  profile1?: string
  civ1?: string
  color1?: number
  player2?: string
  profile2?: string
  civ2?: string
  color2?: number

  constructor(replays: Replay[] | null = null) {
    this.id = gameCounter++
    this.winner = 'none'
    if (Array.isArray(replays)) {
      this.replays = replays
    } else {
      this.replays = [new Replay()]
    }

    if (this.replays.length > 0 && this.replays[0].rec) {
      const rec = this.replays[0].rec
      const game_settings = rec.zheader.game_settings
      const map_id = game_settings.resolved_map_id
      const players = game_settings.players
      this.date = new Date(rec.zheader.timestamp * 1000)
      this.mapName =
        mapNames[map_id] ?? game_settings.rms_strings[1].split(':')[2].replace(/\.rms$/, '')
      this.player1 = players[0].name
      this.profile1 = players[0].profile_id
      this.civ1 = civNames[players[0].civ_id]
      this.color1 = players[0].color_id + 1
      this.player2 = players[1].name
      this.profile2 = players[1].profile_id
      this.civ2 = civNames[players[1].civ_id]
      this.color2 = players[1].color_id + 1
    }
  }

  isDummy() {
    return this.replays.length == 0 || this.replays.findIndex((replay) => !!replay.rec) == -1
  }
}

export class Replay {
  id: number
  file: File | null
  rec: ParsedReplay | null
  constructor(file: File | null = null, rec: ParsedReplay | null = null) {
    this.id = replayCounter++
    this.file = file
    this.rec = rec
  }
}

export type ParsedReplay = {
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

export function normalizePlayerName(playerName: string, defaultName: string) {
  const asciiName = UNICODE_NORMALIZATION
    ? unidecode(playerName)
    : // eslint-disable-next-line no-control-regex
      playerName.replace(/[^\x00-\x7F]/g, '')

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
