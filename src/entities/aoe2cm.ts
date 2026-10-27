export type Aoe2CmEvent = {
  actionType: string
  chosenOptionId: string
  executingPlayer: 'HOST' | 'GUEST' | 'NONE'
  isRandomlyChosen: boolean
  offset: number
  player: 'HOST' | 'GUEST' | 'NONE'
}

type Aoe2CmCategory = string

export type Aoe2CmDraftOption = {
  category: Aoe2CmCategory
  i18nPrefix: string
  id: string
  imageUrls: {
    animated_left: string
    animated_right: string
    emblem: string
    unit: string
  }
  name: string
}

export type Aoe2CmPreset = Aoe2CmPresetSinglePool | Aoe2CmPresetMultiPools

type Aoe2CmPresetBase = {
  name: string
  presetId: string
  turns: Aoe2CmTurn[]
  categoryLimits: {
    pick: Record<Aoe2CmCategory, number>
    ban: Record<Aoe2CmCategory, number>
  }
}

type Aoe2CmPresetSinglePool = Aoe2CmPresetBase & (Aoe2CmPresetEncodedCiv | Aoe2CmPresetDraftOptions)
type Aoe2CmPresetMultiPools = Aoe2CmPresetBase & Aoe2CmPools

type Aoe2CmPresetEncodedCiv = {
  encodedCivilisations: string
}

type Aoe2CmPresetDraftOptions = {
  draftOptions: Aoe2CmDraftOption[]
}

type Aoe2CmPools = {
  pools: Array<
    {
      id: string
      name: string
    } & (Aoe2CmPresetEncodedCiv | Aoe2CmPresetDraftOptions)
  >
}

type Aoe2CmTurn = {
  id: string
  player: string
  action: 'BAN' | 'PICK' | 'SNIPE' | 'STEAL' | 'REVEAL_ALL' // What did I forget?
  exclusivity: 'GLOBAL' | string // TODO: Be more precise
  hidden: boolean
  executingPlayed: 'NONE' | 'HOST' | 'GUEST'
  parallel: boolean
  categories: Aoe2CmCategory[]
  pool?: string
}

// TODO: continue work on this refactoring
/*interface Aoe2CmApi {
  getDraft(draftUri: string): string
}*/
