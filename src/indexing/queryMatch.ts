'use strict'

import {QueryPart} from './queryPart'
import {IndexStorageEntry} from './indexStorageEntry'

export class QueryMatch {
    private matchSuccess: boolean
    private matchRank: number
    private matchEntry: IndexStorageEntry

    constructor(success: boolean, rank: number, entry: IndexStorageEntry) {
        this.matchSuccess = success
        this.matchRank = rank
        this.matchEntry = entry
    }

    public get success(): boolean {
        return this.matchSuccess
    }
    
    public get rank(): number {
        return this.matchRank
    }
    
    public get entry(): IndexStorageEntry {
        return this.matchEntry
    }
}