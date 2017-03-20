'use strict'
import * as fs from 'fs'
import * as os from 'os'
import * as vscode from 'vscode'
import * as fsmock from 'fs-mock'
import * as faker from 'faker'

import {FileSystem} from '../../src/indexing/fileSystem'

export class FileSystemMock extends FileSystem {
    private depth: number
    private root: string
    private separator: string
    private maxFoldersFactor: number
    private maxFilesFactor: number

    private tree: object
    private settings: any
    private fsMock: fsmock
    
    private createHandler: (string) => void
    private deleteHandler: (string) => void

    constructor(depth: number = 5) {
        super(false)
        this.depth = depth
        this.root = this.isWindows() ? "C:\\test" : "/test"
        this.separator = this.isWindows() ? "\\" : "/"
        this.maxFoldersFactor = this.random(0, 10)
        this.maxFilesFactor = this.random(0, 10)
        this.tree = {}
        this.generateEntries(this.tree, this.root, this.depth)

        this.settings = {
            windows: this.isWindows(),
            root: ""
        }
        this.fsMock = new fsmock(this.tree, this.settings)
    }
    
    public toString() {
        return Object.keys(this.tree).join(";")
    }

    public get size() {
        return Object.keys(this.tree).filter(path => this.isFile(path)).length
    }

    public get rootFolder() : string {
        return this.root
    }

    public getFile(): string {
        let path: string
        do {
            let keys = Object.keys(this.tree)
            path = keys[this.random(0, keys.length - 1)]
        }
        while(!this.isFile(path))
        
        return path
    }

    public addFile(): string {
        let path = this.generateEntry(this.tree, this.root, this.depth)
        this.fsMock = new fsmock(this.tree, this.settings)

        if (this.createHandler != null)
            this.createHandler(path)
        return path
    }

    public removeFile(): string {
        let path = this.getFile()
        delete this.tree[path]
        if (this.deleteHandler != null)
            this.deleteHandler(path)
        return path
    }

    public onCreate(handler: (string) => void) {
        
    }

    public onDelete(handler: (string) => void) {
        
    }

    public listFolderAsync(folder: string): Thenable<string[]> {
        return new Promise<string[]>((resolve, reject) => this.fsMock.readdir(folder, (err, files) => !err ? resolve(files) : reject(err)))
    }

    public getFileInfoAsync(file: string): Thenable<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => this.fsMock.lstat(file, (err, stat) => !err ? resolve(stat) : reject(err)))
    }

    private generateEntry(entries: object, root: string, depth: number): string {
        for (let i = 0; i < depth; i++) {
            root = this.generateName(root)
        }
        entries[root] = ""
        return root
    }

    private generateEntries(entries: object, root: string, depth: number) {
        let files = this.random(1, this.maxFilesFactor)
        for (let i = 0; i < files; i++) 
            entries[this.generateName(root)] = ""

        let folders = this.random(0, this.maxFoldersFactor)

        let emptyFolders = Math.floor(folders / 2)
        for (let i = 0; i < emptyFolders; i++)
            entries[this.generateName(root)] = {}

        if (depth > 1) {
            let nonEmptyFolders = folders - emptyFolders
            for (let i = 0; i < nonEmptyFolders; i++)
                this.generateEntries(entries, this.generateName(root), depth - 1)
        }
    }

    private generateName(root: string): string {
        return [root, faker.fake("{{system.fileName}}")].join(this.separator)
    }

    private random(min: number, max: number): number {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    private isFile(path: string): boolean {
        return this.tree[path] == ""
    }

    private isWindows() {
        return os.type().includes("Windows")
    }
}