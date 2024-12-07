import type { DocumentReference } from "firebase/firestore"

export interface IBet {
    matchID: Number,
    matchDate: number,
    home: Number,
    away: Number,
    points: Number,
    counted: Boolean,
    league: String
}

export class BetModel implements IBet {
    matchID: Number
    matchDate: number
    home: Number
    away: Number
    points: Number
    counted: Boolean
    league: String

    reference: DocumentReference
    
    constructor(data: IBet, reference: DocumentReference) {
        this.matchID = data?.matchID || -1
        this.matchDate = data?.matchDate || 0
        this.home = data?.home || 0
        this.away = data?.away || 0
        this.points = data?.points || 0
        this.counted = data?.counted || false
        this.league = data?.league || ''

        this.reference = reference
    }
}

export function toMapBet(data?: Partial<IBet>): IBet {
    return {
        matchID: data?.matchID || -1,
        matchDate: data?.matchDate || 0,
        home: data?.home || 0,
        away: data?.away || 0,
        points: data?.points || 0,
        counted: data?.counted || false,
        league: data?.league || ''
    }
}
