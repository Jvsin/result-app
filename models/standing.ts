export interface IStanding {
    id: Number,
    standings: any
}

export interface Standing {
  id: Number,
    standings: any
}

export function toMapStanding(data?: Partial<Standing>): Standing {
  return {
      id: data?.id || 0,
      standings: data?.standings || null
  }
}
