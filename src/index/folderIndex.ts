'use strict'
import * as fs from 'fs'
import * as fspath from 'path'
import * as vscode from 'vscode'
let wildcard = require('wildcard2')

import FolderIndexStatus from './folderIndexStatus'
import FolderIndexQuery from './folderIndexQuery'
import FolderIndexHandler from './folderIndexHandler'

export default class FolderIndex implements vscode.WorkspaceSymbolProvider, vscode.Disposable {
    private folder: string
    private status: FolderIndexStatus
    private exclude: string[]
    private symbolProvider: vscode.Disposable
    private entries: { [id: string]: vscode.SymbolInformation; }
    private handler: FolderIndexHandler
    private rebuilding: boolean
    
    constructor(folder: string, status: FolderIndexStatus) {
        this.folder = folder
        this.status = status
        this.exclude = vscode.workspace.getConfiguration("folderindex").get<string[]>("exclude")
        this.symbolProvider = vscode.languages.registerWorkspaceSymbolProvider(this)
        this.handler = new FolderIndexHandler(this)
        this.entries = {}

        this.rebuilding = false
    }

    public provideWorkspaceSymbols(queryString: string, token: vscode.CancellationToken): vscode.SymbolInformation[] {
        let result: vscode.SymbolInformation[] = []

        try {
            let query = new FolderIndexQuery(queryString)
            for (var path in this.entries) {
                let entry = this.entries[path]
                if (query.isMatch(entry.name))
                    result.push(entry)
            }
        } catch (error) {
            console.log("Error while providing symbols\n" + error)
        }

        return result
    }

    public dispose() {
        try {
            this.handler.dispose()
            this.symbolProvider.dispose()
        } catch (error) {
            console.log("Error while disposing index\n" + error)
        }
        
    }

    public async rebuild() {
        if (!this.rebuilding && this.folder) {
            this.rebuilding = true

            try {
                this.entries = {}
                this.status.beginBuild()
                await this.addEntries(this.folder)
            }
            catch (error) {
                console.log("Error while rebuilding index\n" + error)
            }
            finally {
                this.rebuilding = false
                this.status.endBuild()
            }
        }
    }

    public async addEntries(path: string) {
        try {
            this.status.notifyBuild(path)

            let fileInfo = await this.getFileInfoAsync(path)
            if (fileInfo.isDirectory()) {
                let folder = path

                let folderPaths = (await this.listFolderAsync(folder))
                    .map(f => fspath.resolve(folder, f))
                    .filter(f => !this.isExcludedPath(f))
                for (var folderPath of folderPaths)
                    await this.addEntries(folderPath)
            }
            else if (!this.isExcludedPath(path)) {
                let name = fspath.basename(path)
                let location = new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0))
                let symbol = new vscode.SymbolInformation(name, vscode.SymbolKind.File, '', location)
                this.entries[symbol.location.uri.fsPath] = symbol
            }
        } catch (error) {
            console.log("Error while adding entries\n" + error)
        }
    }

    public async removeEntries(path: string) {
        try {
            let pathsToDelete = []

            for (let entryPath in this.entries) {
                if (this.entries.hasOwnProperty(entryPath)) {
                    if (entryPath.startsWith(path))
                        pathsToDelete.push(entryPath)
                }
            }

            for (let entryPath of pathsToDelete) {
                delete this.entries[entryPath]
            }
        } catch (error) {
            console.log("Error while removing entries\n" + error)
        }
    }

    private isExcludedPath(path: string) : boolean {
        return this.exclude.some(e => wildcard(path, e))
    }

    private listFolderAsync(folder: string): Thenable<string[]> {
        return new Promise<string[]>((resolve, reject) => fs.readdir(folder, (err, files) => !err ? resolve(files) : reject(err)))
    }

    private getFileInfoAsync(file: string): Thenable<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => fs.lstat(file, (err, stat) => !err ? resolve(stat) : reject(err)))
    }
}