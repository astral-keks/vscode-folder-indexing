'use strict'

import * as vscode from 'vscode'

export class IndexStorageEntry {
    private entryLongKey: string
    private entryShortKey: string
    private entryPath: string
    private entrySymbol: vscode.SymbolInformation

    constructor(longKey: string, shortKey: string, path: string, symbol: vscode.SymbolInformation) {
        this.entryLongKey = longKey
        this.entryShortKey = shortKey
        this.entryPath = path
        this.entrySymbol = symbol
    }

    public get longKey(): string {
        return this.entryLongKey
    }
    
    public get shortKey(): string {
        return this.entryShortKey
    }
    
    public get path(): string {
        return this.entryPath
    }
    
    public get symbol(): vscode.SymbolInformation {
        return this.entrySymbol
    }
}