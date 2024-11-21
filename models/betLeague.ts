import { Timestamp } from "@google-cloud/firestore"
import { DocumentReference } from "firebase/firestore"

export interface ILeague {
    leagueCode: string,
    name: string,
    description: string,
    league: string,
    owner: DocumentReference,
    players: DocumentReference[]
    created: Number,
    isPublic: boolean
}

export class LeagueModel implements ILeague {
    leagueCode: string
    name: string
    description: string
    league: string
    owner: DocumentReference
    players: DocumentReference[]
    created: Number
    isPublic: boolean

    reference: DocumentReference
    
    constructor(data: ILeague, reference: DocumentReference) {
        this.leagueCode = data?.leagueCode || ''
        this.description = data?.description || ''
        this.league = data?.league || ''
        this.name = data?.name || ''
        this.owner = data?.owner || null
        this.players = data?.players || []
        this.created = data?.created || new Date()
        this.isPublic = data?.isPublic || false

        this.reference = reference
    }
}

// export function toMapBet(data?: Partial<I>): IBet {
//     return {
//         matchID: data?.matchID || -1,
//         matchDate: data?.matchDate || 0,
//         home: data?.home || 0,
//         away: data?.away || 0,
//         points: data?.points || 0,
//         counted: data?.counted || false,
//         league: data?.league || ''
//     }
// }
