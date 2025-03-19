/// <reference types="vite/client" />

declare module 'virtual:tournaments-data' {
  type Tournament = {
    name: string,
    civs: string[]
    maps: string[]
  }
  const data: Record<string, Tournament>
  export = data
}
