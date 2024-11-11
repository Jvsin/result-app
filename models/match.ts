import type { Timestamp } from "firebase/firestore"

export interface IMatch {
  id: number,
  league: String,
  status: String,
  round: String,
  timestamp: number,
  homeName: String,
  awayName: String,
  goalsHome: Number | null,
  goalsAway: Number | null,
  homeLogo: any,
  awayLogo: any,
  timeElapsed: Number,
  isFinished: boolean
}

export interface Match {
  id: Number,
  league: String,
  status: String,
  round: String,
  timestamp: number,
  homeName: String,
  awayName: String,
  goalsHome: Number,
  goalsAway: Number,
  homeLogo: any,
  awayLogo: any,
  timeElapsed: Number,
  isFinished: boolean
}

// export function toMapMatch(data?: Partial<Match>): Match {
//   return {
//     id: data?.id || 0,
//     data: data?.data || null,
//     isFinished: data?.isFinished || true
//   }
// }
