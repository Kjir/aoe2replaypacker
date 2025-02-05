import { describe, it, expect } from 'vitest'
import {
  normalizePlayerName,
  matchName,
  zipFilename,
  computeReplayFilename,
  computeReplayFilenamePreview,
  Game,
  Replay
} from './game'

describe('normalizePlayerName', () => {
  it('does not modify acceptable name', () => {
    expect(normalizePlayerName('Player3', 'DefaultName')).toBe('Player3')
  })
  it('removes whitespace', () => {
    expect(normalizePlayerName(' P l a y e r 3 ', 'DefaultName')).toBe('Player3')
  })
  it('removes bad characters', () => {
    expect(normalizePlayerName('Player<>:"/\\Three ', 'DefaultName')).toBe('PlayerThree')
  })
})

describe('normalizePlayerName', () => {
  it('uses default name if result is empty', () => {
    expect(normalizePlayerName('<>:"/\\', 'DefaultName')).toBe('DefaultName')
  })
})

describe('matchName', () => {
  it('generates a correct match name', () => {
    expect(matchName('Player1', 'Player2')).toBe('Player1_vs_Player2')
  })
})

describe('zipFilename', () => {
  it('generates a correct zip filename', () => {
    expect(zipFilename('Player1', 'Player2')).toBe('Player1_vs_Player2.zip')
  })
})

describe('computeReplayFilename', () => {
  it('creates some replay file names', () => {
    const game1 = new Game()
    for (let i = 0; i < 30; i++) {
      game1.replays.push({} as Replay) // Actual object is irrelevant
    }

    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 0, 27)).toBe(
      'Player3_vs_Player4_G1bb.aoe2record'
    )
    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 1, 25)).toBe(
      'Player3_vs_Player4_G2az.aoe2record'
    )
    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 2, 28)).toBe(
      'Player3_vs_Player4_G3bc.aoe2record'
    )
  })
})

describe('computeReplayFilenamePreview', () => {
  it('create some replay file names', () => {
    const game1 = new Game()
    for (let i = 0; i < 30; i++) {
      game1.replays.push({} as Replay) // Actual object is irrelevant
    }
    game1.replays[27].file = new File([''], 'testfile.aoe2record', {
      type: 'application/octet-stream'
    })

    expect(
      computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 0, game1.replays[27], 27)
    ).toBe('Player3_vs_Player4_G1bb.aoe2record')
    expect(
      computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 1, game1.replays[25], 25)
    ).toBe('Player3_vs_Player4_G2az.aoe2record (dummy file)')
    expect(
      computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 2, game1.replays[28], 28)
    ).toBe('Player3_vs_Player4_G3bc.aoe2record (dummy file)')
  })
})
