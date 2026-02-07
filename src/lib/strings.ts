export function commonPrefix(words: string[]) {
  const firstWord = words[0] ?? ''

  // check border cases size 1 array and empty first word)
  if (!words[0] || words.length == 1) return words[0] || ''
  let i = 0

  // while all words have the same character at position i, increment i
  while (words[0][i] && words.every((w) => w[i] === firstWord[i])) {
    i++
  }

  // prefix is the substring from the beginning to the last successfully checked i
  return words[0].slice(0, i)
}
