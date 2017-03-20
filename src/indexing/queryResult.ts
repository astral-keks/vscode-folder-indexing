'use strict'

import * as vscode from 'vscode'

import {QueryMatch} from './queryMatch'

export class QueryResult {
    private maxSize: number
    private matches: QueryMatch[]

    constructor(maxSize: number) {
        this.maxSize = maxSize
        this.matches = []
    }

    public append(match: QueryMatch) {
        this.matches.push(match)
    }

    public toSymbols(): vscode.SymbolInformation[] {
        let sortedMatches = this.matches.sort((m1, m2) => m2.rank - m1.rank)
        return sortedMatches.slice(0, this.maxSize).map(m => m.entry.symbol)
    }
}