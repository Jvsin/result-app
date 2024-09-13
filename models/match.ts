export interface IMatch {
  id: Number,
  data: any,
  isFinished: boolean
}

export interface Match {
  id: Number,
  data: any,
  isFinished: boolean
}

export function toMapMatch(data?: Partial<Match>): Match {
  return {
    id: data?.id || 0,
    data: data?.data || null,
    isFinished: data?.isFinished || true
  }
}
