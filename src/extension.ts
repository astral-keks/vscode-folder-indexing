'use strict'
import * as vscode from 'vscode'

import FolderIndex from './index/folderIndex'
import FolderIndexStatus from './index/folderIndexStatus'

export function activate(context: vscode.ExtensionContext) {
    
    let status = new FolderIndexStatus()
    let index = new FolderIndex(vscode.workspace.rootPath, status)
    let command = vscode.commands.registerCommand('folderindexing.rebuildindex', () => { index.rebuild() })
    
    context.subscriptions.push(status)
    context.subscriptions.push(index)
    context.subscriptions.push(command)
    
    vscode.commands.executeCommand('folderindexing.rebuildindex')
}

export function deactivate() {
}