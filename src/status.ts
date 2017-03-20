'use strict'

import * as vscode from 'vscode'

import {IndexStorageEvents} from './indexing/indexStorageEvents'

export class ExtensionStatus extends IndexStorageEvents {
    private statusBarItem: vscode.StatusBarItem

    constructor() {
        super()
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
    }

    public dispose() {
        this.statusBarItem.dispose()
    }

    public onBeginRebuild() {
        this.statusBarItem.show()
    }

    public onRebuild(path: string) {
        this.statusBarItem.text = 'Indexing: ' + path
    }

    public onEndRebuild() {
        this.statusBarItem.hide()
    }
}