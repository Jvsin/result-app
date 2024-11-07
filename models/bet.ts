export interface IBet {
    matchID: Number,
    matchDate: Date,
    home: Number,
    away: Number,
    points: Number,
    counted: Boolean,
    league: String
}

export class BetModel implements IBet {
    matchID: Number
    matchDate: Date
    home: Number
    away: Number
    points: Number
    counted: Boolean
    league: String
    
    constructor(data: IBet) {
        this.matchID = data?.matchID || -1
        this.matchDate = data?.matchDate || new Date()
        this.home = data?.home || -1
        this.away = data?.away || -1
        this.points = data?.points || 0
        this.counted = data?.counted || false
        this.league = data?.league || ''
    }
}

export function toMapUser(data?: Partial<IBet>): IBet {
    return {
        matchID: data?.matchID || -1,
        matchDate: data?.matchDate || new Date(),
        home: data?.home || -1,
        away: data?.away || -1,
        points: data?.points || 0,
        counted: data?.counted || false,
        league: data?.league || ''
    }
}
