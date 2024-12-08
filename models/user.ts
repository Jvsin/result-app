import type { DocumentReference } from "firebase/firestore"
import { type TRole } from "~/types/role"

export interface IUser {
    email: String,
    nick: String,
    name: String,
    surname: String,
    favLeagues: [],
    photo: String,
    role: TRole,
    leagues: DocumentReference[],
    polPoints: Number,
    engPoints: Number,
    uclPoints: Number,
    betAcc: Number,
    established: Date,
    userCode: string
}

export class UserModel implements IUser {
    email: String
    nick: String
    name: String
    surname: String
    favLeagues: []
    photo: String
    role: TRole
    leagues: DocumentReference[]
    polPoints: Number
    engPoints: Number
    uclPoints: Number
    betAcc: Number
    established: Date
    userCode: String

    reference: DocumentReference | null
    
    constructor(data: IUser, reference: DocumentReference) {
        this.email = data.email || ''
        this.nick = data.nick || '',
        this.name = data.name || '',
        this.surname = data.surname || ''
        this.favLeagues = data.favLeagues || []
        this.photo = data.photo || '',
        this.role = data.role || 'user'
        this.leagues = data.leagues || []
        this.polPoints = data.polPoints || 0
        this.engPoints = data.engPoints || 0
        this.uclPoints = data.uclPoints || 0
        this.betAcc = data.betAcc || 0
        this.established = data.established || new Date()
        this.userCode = data.userCode || ''

        this.reference = reference
    }
}

export function toMapUser(data?: Partial<IUser>): IUser {
    return {
        email: data?.email || '',
        nick: data?.nick || '',
        name: data?.name || '',
        surname: data?.surname || '',
        favLeagues: data?.favLeagues || [],
        photo: data?.photo || '',
        role: data?.role || 'user',
        leagues: data?.leagues || [],
        polPoints: data?.polPoints || 0,
        engPoints: data?.engPoints || 0,
        uclPoints: data?.uclPoints || 0,
        betAcc: data?.betAcc || 0,
        established: data?.established || new Date(),
        userCode: data?.userCode|| ''
    }
}
