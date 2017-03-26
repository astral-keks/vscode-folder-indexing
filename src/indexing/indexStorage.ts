'use strict'

let wildcard = require('wildcard2')

import * as fspath from 'path'
import * as vscode from 'vscode'

import {IndexStorageSettings} from './indexStorageSettings'
import {IndexStorageEvents} from './indexStorageEvents'
import {IndexStorageEntry} from './indexStorageEntry'
import {Query} from './query'
import {QueryResult} from './queryResult'
import {FileSystem} from './fileSystem'
import {Tokenizer} from './tokenizer'

export class IndexStorage implements vscode.WorkspaceSymbolProvider, vscode.Disposable {
    private folder: string
    private fileSystem: FileSystem
    private settings: IndexStorageSettings
    private events: IndexStorageEvents

    private entries: Map<string, IndexStorageEntry>
    private tokenizer: Tokenizer

    private rebuilding: boolean
    
    constructor(folder: string, fileSystem: FileSystem, settings: IndexStorageSettings, events: IndexStorageEvents = null) {
        this.folder = folder
        this.fileSystem = fileSystem
        this.settings = settings
        this.events = events != null ? events : new IndexStorageEvents

        this.fileSystem.onCreate(path => this.addEntries(path))
        this.fileSystem.onDelete(path => this.removeEntries(path))

        this.entries = new Map<string, IndexStorageEntry>()
        this.tokenizer = new Tokenizer()

        this.rebuilding = false
    }

    public provideWorkspaceSymbols(queryString: string, token: vscode.CancellationToken = null): vscode.SymbolInformation[] {
        let result = new QueryResult(this.settings.searchResultMaxSize)
        let language = this.getCurrentLanguage()

        if (queryString != null && queryString.length > 0 && (language == null || this.settings.languageExceptions.indexOf(language) < 0)) {
            try {
                queryString = this.tokenizer.getJointTokens(queryString)
                let query = new Query(queryString, this.settings.searchFullPath)
                for (let entry of this.entries.values()) {
                    let match = query.getMatch(entry)
                    if (match.success) {
                        result.append(match)
                    }
                }
            } catch (error) {
                console.log("Error while providing symbols\n" + error)
            }
        }

        return result.toSymbols()
    }

    public dispose() {
        try {
            this.entries.clear()
            this.fileSystem.dispose()
        } catch (error) {
            console.log("Error while disposing index\n" + error)
        }
    }

    public async rebuild() {
        if (!this.rebuilding && this.folder) {
            this.rebuilding = true

            try {
                this.entries = new Map<string, IndexStorageEntry>()
                this.events.onBeginRebuild()
                await this.addEntries(this.folder)
            }
            catch (error) {
                console.log("Error while rebuilding index\n" + error)
            }
            finally {
                this.rebuilding = false
                this.events.onEndRebuild()
            }
        }
    }

    public get size() {
        return this.entries.size
    }

    private async addEntries(path: string) {
        try {
            this.events.onRebuild(path)

            let fileInfo = await this.fileSystem.getFileInfoAsync(path)
            if (fileInfo.isDirectory()) {
                let folder = path

                let folderPaths = (await this.fileSystem.listFolderAsync(folder))
                    .map(f => fspath.resolve(folder, f))
                    .filter(f => !this.isExcludedPath(f))
                for (var folderPath of folderPaths)
                    await this.addEntries(folderPath)
            }
            else if (!this.isExcludedPath(path)) {
                this.addEntry(path)
            }
        } catch (error) {
            console.log("Error while adding entries\n" + error)
        }
    }

    private async removeEntries(path: string) {
        try {
            let entriesToDelete = []
            for (let entry of this.entries.values()) {
                if (entry.path.startsWith(path))
                    entriesToDelete.push(entry)
            }
        } catch (error) {
            console.log("Error while removing entries\n" + error)
        }
    }

    private addEntry(path: string) {
        let name = fspath.basename(path)
        let location = new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0))
        let symbol = new vscode.SymbolInformation(name, vscode.SymbolKind.File, '', location)
        
        let longKey = this.tokenizer.getSeparatedTokens(path)
        let shortKey = this.tokenizer.getSeparatedTokens(name)
        let entry = new IndexStorageEntry(longKey, shortKey, path, symbol)
        this.entries.set(entry.longKey, entry)
    }

    private removeEntry(path: string) {
        let key = this.tokenizer.getSeparatedTokens(path)
        this.entries.delete(key)
    }

    private isExcludedPath(path: string): boolean {
        return this.settings.excludePatterns.some(e => wildcard(path, e))
    }

    private getCurrentLanguage(): string {
        let activeDocument = vscode.window.activeTextEditor 
            ? vscode.window.activeTextEditor.document
            : null
        let language = activeDocument
            ? activeDocument.languageId
            : null
        return language
    }
}