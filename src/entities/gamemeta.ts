export type MapDraft = {
  draft: string
  preset: string
  host: string
  guest: string
  pickedMaps: string[]
  availableMaps: Record<string, { name: string; image: string }>
}
export type CivDraft = {
  draft: string
  preset: string
  host: string
  guest: string
  hostCivs: string[]
  guestCivs: string[]
}

export type ReplayMetadata = {
  maps: MapDraft | null
  civs: CivDraft | null
  player1_score: number | null
  player2_score: number | null
}

export type ReplayErrors = {
  maps: string | null
  civs: string | null
}
