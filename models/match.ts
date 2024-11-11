import type { Timestamp } from "firebase/firestore"

export interface IMatch {
  id: Number,
  status: String,
  round: String,
  timestamp: Timestamp,
  homeName: String,
  awayName: String,
  goalsHome: Number,
  goalsAway: Number,
  homeLogo: any,
  awayLogo: any,
  timeElapsed: Number,
  isFinished: boolean
}

export interface Match {
  id: Number,
  status: String,
  round: String,
  timestamp: Timestamp,
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
