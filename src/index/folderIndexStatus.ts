'use strict'
import * as vscode from 'vscode'

export default class FolderIndexStatus implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
    }

    public dispose() {
        this.statusBarItem.dispose()
    }

    public beginBuild() {
        this.statusBarItem.show()
    }

    public notifyBuild(path: string) {
        this.statusBarItem.text = 'Building index: ' + path
    }

    public endBuild() {
        this.statusBarItem.hide()
    }
}