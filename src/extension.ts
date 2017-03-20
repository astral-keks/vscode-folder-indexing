'use strict'

import * as vscode from 'vscode'

import {ExtensionSettings} from './settings'
import {ExtensionCommands} from './commands'
import {ExtensionStatus} from './status'
import {IndexStorage} from './indexing/indexStorage'
import {FileSystem} from './indexing/fileSystem'

export function activate(context: vscode.ExtensionContext) {
    
    let status = new ExtensionStatus()
    context.subscriptions.push(status)
    let settings = new ExtensionSettings()
    let fileSystem = new FileSystem()
    let index = new IndexStorage(vscode.workspace.rootPath, fileSystem, settings, status)
    context.subscriptions.push(index)

    let commands = new ExtensionCommands(settings)
    let command = vscode.commands.registerCommand(commands.rebuild, () => { index.rebuild() })
    context.subscriptions.push(command)
    
    vscode.commands.executeCommand(commands.rebuild)
}

export function deactivate() {
}