export enum MatchSetType {
  BestOf = 'Best of',
  PlayAll = 'Play all'
}

function parseMatchSetType(matchSetType: string): MatchSetType {
  switch (matchSetType) {
    case 'bo':
      return MatchSetType.BestOf
    case 'pa':
      return MatchSetType.PlayAll
    default:
      throw new Error(`Invalid set type: ${matchSetType}`)
  }
}

export class MatchSetDefinition {
  type: MatchSetType
  length: number

  constructor(type: MatchSetType, length: number) {
    this.type = type
    this.length = length
  }

  public label(): string {
    return `${this.type.toString()} ${this.length}`
  }

  public static parse(matchSet: string): MatchSetDefinition {
    const matchSetRegex = new RegExp('^(bo|pa)([0-9]+)$')
    const matchSetMatch = matchSet.match(matchSetRegex)
    if (!matchSetMatch) {
      throw new Error(`Invalid set definition: ${matchSet}`)
    }

    const setType = parseMatchSetType(matchSetMatch[1])
    const lengthStr = matchSetMatch[2]
    const length = parseInt(lengthStr)

    if (isNaN(length)) {
      throw new Error(`Invalid set length: ${lengthStr}`)
    }

    return new MatchSetDefinition(setType, length)
  }
}
