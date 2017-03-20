'use strict'

import * as vscode from 'vscode'

import {IndexStorageSettings} from './indexing/indexStorageSettings'

export class ExtensionSettings extends IndexStorageSettings {
    
    public get extensionIdentifier(): string {
        return "folder-indexing"
    }

    public get excludePatterns(): string[] {
        return this.configuration.get<string[]>("exclude")
    }

    public get searchResultMaxSize(): number {
        return this.configuration.get<number>("searchResultMaxSize")
    }

    public get searchFullPath(): boolean {
        return this.configuration.get<string>("searchMode") == "fullpath"
    }

    private get configuration(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(this.extensionIdentifier)
    }
}