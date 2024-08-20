import { expect, test } from 'vitest'
import { normalizePlayerName, matchName, zipFilename, toBase26, logn } from './game'

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
