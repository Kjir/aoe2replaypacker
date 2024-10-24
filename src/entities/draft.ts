
enum DraftType {
    Unknown,
    Map,
    Civ
}

export type draft = {
    draftId: string
    presetId: string
    title: string
    nameHost: string
    nameGuest: string
}

function getDraftType(draft: draft, mapPresets: string[], civPresets: string[]) {
    if (mapPresets.includes(draft.presetId)) {
        return DraftType.Map
    } else if (civPresets.includes(draft.presetId)) {
        return DraftType.Civ
    } else {
        return DraftType.Unknown
    }
}

export function getDraftTypeLabel(draft: draft, mapPresets: string[], civPresets: string[]) {
    const draftType = getDraftType(draft, mapPresets, civPresets)
    if (draftType == DraftType.Civ) {
        return 'Civs:'
    } else if (draftType == DraftType.Map) {
        return 'Maps:'
    } else {
        return ''
    }
}

export const extractDraftId = (url?: string) => {
    if (!url) {
        return ''
    }
    return url.replace(/https:\/\/aoe2cm\.net\/(draft|spectate)\//, '').replace(/\/$/, '')
}

export const extractDraftUrl = (url?: string) => {
    if (!url) {
        return ''
    }
    const draftId = extractDraftId(url);
    if (!draftId) {
        return ''
    }
    return `https://aoe2cm.net/draft/${draftId}`
}
