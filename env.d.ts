/// <reference types="vite/client" />

declare module 'virtual:tournaments-data' {
  type Tournament = {
    civs: string[]
    maps: string[]
  }
  const data: Record<string, Tournament>
  export = data
}
