export interface IStanding {
  id: Number,
  nextRound: Number,
  standings: any
}

export interface Standing {
  id: Number,
  nextRound: Number,
  standings: any
}

export function toMapStanding(data?: Partial<Standing>): Standing {
  return {
    id: data?.id || 0,
    nextRound: data?.nextRound || 0,
    standings: data?.standings || null
  }
}
