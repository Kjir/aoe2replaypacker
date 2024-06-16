
export type MapDraft = { draft: string; preset: string; host: string; guest: string; maps: [string] }
export type CivDraft = { draft: string; preset: string; host: string; guest: string; hostCivs: [string]; guestCivs: [string] }

export type ReplayMetadata = {
    maps: MapDraft | null
    civs: CivDraft | null
};
