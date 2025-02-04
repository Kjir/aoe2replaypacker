import unidecode from 'unidecode'
import { logn, toBase26 } from '../lib/maths'
import { mapNames } from './maps'
import { civNames } from './civs'

const UNICODE_NORMALIZATION = false // Setting this to true doubles the code size

let gameCounter = 0
let replayCounter = 0

export class Player {
  name: string
  profile: string
  civ: string
  team_id: number
  color: number

  constructor(name: string, profile: string, civ: string, team_id: number, color: number) {
    this.name = name
    this.profile = profile
    this.civ = civ
    this.team_id = team_id
    this.color = color
  }
}

export class Team {
  id: number
  players: Player[]
  constructor(team_id: number, players: Player[]) {
    this.id = team_id
    this.players = players
  }
}

export class Game {
  replays: Replay[] = []
  winner: 'left' | 'none' | 'right'
  id: number
  date?: Date
  mapName?: string
  teams?: Team[]

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
      this.date = new Date(rec.zheader.timestamp * 1000)
      this.mapName =
        mapNames[map_id] ?? game_settings.rms_strings[1].split(':')[2].replace(/\.rms$/, '')
      this.teams = getTeams(rec)
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
        resolved_team_id: number
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

function getTeams(replay: ParsedReplay) {
  const players = replay.zheader.game_settings.players
  const parsedPlayers = players.map((player, index) => {
    const resolved_team_id = player.resolved_team_id
    const team_id = resolved_team_id == 1 ? 9 + index : resolved_team_id
    return new Player(
      player.name,
      player.profile_id,
      civNames[player.civ_id],
      team_id,
      player.color_id + 1
    )
  })
  const team_ids = new Set(parsedPlayers.map((player) => player.team_id))
  return Array.from(team_ids).map(
    (team_id) =>
      new Team(
        team_id,
        parsedPlayers.filter((player) => player.team_id == team_id)
      )
  )
}
