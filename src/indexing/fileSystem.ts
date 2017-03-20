'use strict'

import * as fs from 'fs'
import * as vscode from 'vscode'

export class FileSystem implements vscode.Disposable {
    private fsWatcher: vscode.FileSystemWatcher

    constructor(createWatcher: boolean = true) {
        if (createWatcher)
            this.fsWatcher = vscode.workspace.createFileSystemWatcher("**")
    }

    public dispose() {
        if (this.fsWatcher != null)
            this.fsWatcher.dispose()
    }

    public onCreate(handler: (string) => void) {
        this.fsWatcher.onDidCreate(uri => handler(uri.fsPath))
    }

    public onDelete(handler: (string) => void) {
        this.fsWatcher.onDidDelete(uri => handler(uri.fsPath))
    }

    public listFolderAsync(folder: string): Thenable<string[]> {
        return new Promise<string[]>((resolve, reject) => fs.readdir(folder, (err, files) => !err ? resolve(files) : reject(err)))
    }

    public getFileInfoAsync(file: string): Thenable<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => fs.lstat(file, (err, stat) => !err ? resolve(stat) : reject(err)))
    }
}