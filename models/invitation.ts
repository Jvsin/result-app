import { Timestamp } from "@google-cloud/firestore"
import { DocumentReference, type DocumentData } from "firebase/firestore"

export interface IInvitation {
    leagueReference: DocumentReference,
    leagueCode: string,
    user: DocumentReference,
    creationDate: Timestamp,
    isAccepted: boolean
}

export class InvitationModel implements IInvitation {
    leagueReference: DocumentReference
    leagueCode: string
    user: DocumentReference
    creationDate: Timestamp
    isAccepted: boolean

    reference: DocumentReference
    
    constructor(data: IInvitation, reference: DocumentReference) {
        this.leagueReference = data?.leagueReference || null
        this.leagueCode = data?.leagueCode || ''
        this.user = data?.user || null
        this.creationDate = data?.creationDate || new Date()
        this.isAccepted = data?.isAccepted || false

        this.reference = reference
    }
}