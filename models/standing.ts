export interface IStanding {
  id: Number,
  nextRound: Number,
  standings: any,
  lastUpdate: Date
}

export interface Standing {
  id: Number,
  nextRound: Number,
  standings: any,
  lastUpdate: Date
}

export function toMapStanding(data?: Partial<Standing>): Standing {
  return {
    id: data?.id || 0,
    nextRound: data?.nextRound || 0,
    standings: data?.standings || null,
    lastUpdate: data?.lastUpdate || new Date()
  }
}
