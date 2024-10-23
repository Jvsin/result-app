import type { DocumentReference } from "firebase/firestore"
import { type TRole } from "~/types/role"

export interface IUser {
    email: String,
    nick: String,
    name: String,
    surname: String,
    favLeagues: Number[],
    photo: String,
    role: TRole,
    leagues: String []
}

export class UserModel implements IUser {
    email: String
    nick: String
    name: String
    surname: String
    favLeagues: Number[]
    photo: String
    role: TRole
    leagues: String[]

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
        leagues: data?.leagues || []
    }
}
