
export type Aoe2CmEvent = {
    actionType: string
    chosenOptionId: string
    executingPlayer: 'HOST' | 'GUEST' | 'NONE'
    isRandomlyChosen: boolean
    offset: number
    player: 'HOST' | 'GUEST' | 'NONE'
}

