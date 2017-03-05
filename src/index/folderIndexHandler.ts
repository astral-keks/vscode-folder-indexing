'use strict'
import * as vscode from 'vscode'

import FolderIndex from './folderIndex'

export default class FolderIndexQuery implements vscode.Disposable {

    private index: FolderIndex
    private fsWatcher: vscode.FileSystemWatcher

    constructor(index: FolderIndex) {
        this.index = index
        this.fsWatcher = vscode.workspace.createFileSystemWatcher("**")
        this.fsWatcher.onDidCreate(uri => this.handleCreate(uri.fsPath))
        this.fsWatcher.onDidDelete(uri => this.handleDelete(uri.fsPath))
    }

    public dispose() {
        this.fsWatcher.dispose()
    }

    private handleCreate(path: string) {
        this.index.addEntries(path)
    }

    private handleDelete(path: string) {
        this.index.removeEntries(path)
    }
}