'use strict'

export class IndexStorageSettings {
    
    public get excludePatterns(): string[] {
        return []
    }

    public get searchResultMaxSize(): number {
        return 400
    }

    public get searchFullPath(): boolean {
        return false
    }

    public get languageExceptions(): string[] {
        return []
    }
}