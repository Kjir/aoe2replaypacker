import { expect, test } from 'vitest'
import { normalizePlayerName, matchName, zipFilename, computeReplayFilename, computeReplayFilenamePreview, Game, Replay } from './game'

test('normalizePlayerName: Do not modify acceptable name', () => {
    expect(normalizePlayerName('Player3', 'DefaultName')).toBe('Player3')
})

test('normalizePlayerName: Remove whitespace', () => {
    expect(normalizePlayerName(' P l a y e r 3 ', 'DefaultName')).toBe('Player3')
})

test('normalizePlayerName: Remove bad characters', () => {
    expect(normalizePlayerName('Player<>:"/\\Three ', 'DefaultName')).toBe('PlayerThree')
})

test('normalizePlayerName: Use default name if result is empty', () => {
    expect(normalizePlayerName('<>:"/\\', 'DefaultName')).toBe('DefaultName')
})

test('matchName: Generate a correct match name', () => {
    expect(matchName('Player1', 'Player2')).toBe('Player1_vs_Player2')
})

test('zipFilename: Generate a correct zip filename', () => {
    expect(zipFilename('Player1', 'Player2')).toBe('Player1_vs_Player2.zip')
})

test('computeReplayFilename: Create some replay file names', () => {
    const game1 = new Game();
    for (let i = 0; i < 30; i++) {
        game1.replays.push(new Replay());
    }

    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 0, 27)).toBe('Player3_vs_Player4_G1bb.aoe2record')
    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 1, 25)).toBe('Player3_vs_Player4_G2az.aoe2record')
    expect(computeReplayFilename('Playe<>r 3', ' Pl ay::er 4 ', game1, 2, 28)).toBe('Player3_vs_Player4_G3bc.aoe2record')
})

test('computeReplayFilenamePreview: Create some replay file names', () => {
    const game1 = new Game();
    for (let i = 0; i < 30; i++) {
        game1.replays.push(new Replay());
    }
    game1.replays[27].file = new File([""], "testfile.aoe2record", { type: 'application/octet-stream' });

    expect(computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 0, game1.replays[27], 27)).toBe('Player3_vs_Player4_G1bb.aoe2record')
    expect(computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 1, game1.replays[25], 25)).toBe('Player3_vs_Player4_G2az.aoe2record (dummy file)')
    expect(computeReplayFilenamePreview('Playe<>r 3', ' Pl ay::er 4 ', game1, 2, game1.replays[28], 28)).toBe('Player3_vs_Player4_G3bc.aoe2record (dummy file)')
})
