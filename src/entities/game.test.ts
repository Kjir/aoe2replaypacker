import { expect, test } from 'vitest'
import { normalizePlayerName, matchName, zipFilename, toBase26, logn, computeReplayFilename, computeReplayFilenamePreview, Game, Replay } from './game'

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

test('logn: Calculate logs', () => {
    expect(logn(8, 2)).toBe(3)
    expect(logn(100, 10)).toBe(2)
    expect(logn(676, 26)).toBe(2)
    expect(logn(17576, 26)).toBe(3)
})

test('toBase26: Convert small numbers', () => {
    expect(toBase26(0, 1)).toBe('a')
    expect(toBase26(1, 1)).toBe('b')
    expect(toBase26(2, 1)).toBe('c')
    expect(toBase26(3, 1)).toBe('d')
})

test('toBase26: Convert large numbers', () => {
    expect(toBase26(25, 2)).toBe('az')
    expect(toBase26(26, 2)).toBe('ba')
    expect(toBase26(27, 2)).toBe('bb')
    expect(toBase26(28, 2)).toBe('bc')
})

test('toBase26: Convert very large numbers', () => {
    expect(toBase26(675, 3)).toBe('azz')
    expect(toBase26(676, 3)).toBe('baa')
    expect(toBase26(677, 3)).toBe('bab')
    expect(toBase26(678, 3)).toBe('bac')
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
