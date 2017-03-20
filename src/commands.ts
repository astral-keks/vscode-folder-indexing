'use strict'

import {ExtensionSettings} from './settings'

export class ExtensionCommands {
    private settings: ExtensionSettings

    constructor(settings: ExtensionSettings) {
        this.settings = settings
    }

    public get rebuild() : string {
        return this.fullCommandName("rebuildindex")
    }
    
    private fullCommandName(commandName: string) {
        return this.settings.extensionIdentifier + "." + commandName
    }
}