'use strict'
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fspath from 'path'

import {FileSystemMock} from './mocks/fileSystemMock'
import {IndexStorageSettings} from '../src/indexing/indexStorageSettings'
import {IndexStorage} from '../src/indexing/indexStorage'
import {Tokenizer} from '../src/indexing/tokenizer'

suite("folder index search", function() {
    this.timeout(3600000)
    let testCount = 10

    let fileSystem: FileSystemMock
    let settings: IndexStorageSettings
    let index: IndexStorage

    setup(done => {
        fileSystem = new FileSystemMock()
        settings = new IndexStorageSettings()
        index = new IndexStorage(fileSystem.rootFolder, fileSystem, settings)
        index.rebuild().then(value => done())
    })

    teardown(() => {
        fileSystem.dispose()
        index.dispose()
    })

    for (let i = 0; i < testCount; i++)
    test(`should return non-empty result (${i})`, () => {
        let randomFile = fileSystem.getFile()
        let randomFilename = fspath.basename(randomFile)

        let result = index.provideWorkspaceSymbols(randomFilename)

        assert.ok(result.length > 0, 
            `No result was returned for '${randomFilename}'. FS: ${fileSystem.size}. I: ${index.size}`)
    });

    for (let i = 0; i < testCount; i++)
    test(`should return empty result (${i})`, () => {
        let randomFile = fileSystem.getFile()
        let randomFilename = fspath.basename(randomFile) + "some_stuff"

        let result = index.provideWorkspaceSymbols(randomFilename)

        assert.ok(result.length == 0, 
            `Some result was returned: '${result.length > 0 ? result[0].location.uri.fsPath : ""}'. FS: ${fileSystem.size}. I: ${index.size}`)
    });

    for (let i = 0; i < testCount; i++)
    test(`should return item matching exact query (${i}) `, () => {
        let randomFile = fileSystem.getFile()
        let randomFilename = fspath.basename(randomFile)

        let result = index.provideWorkspaceSymbols(randomFilename)

        assert.ok(result.length > 0, `No result was returned for '${randomFilename}'. FS: ${fileSystem.size}. I: ${index.size}`)
        assert.ok(result[0].location.uri.fsPath.toLowerCase() == randomFile.toLowerCase(), 
            `Wrong result ${result[0].location.uri.fsPath} was returned for '${randomFilename}'. FS: ${fileSystem.size}. I: ${index.size}`)
    });

    for (let i = 0; i < testCount; i++)
    test(`should return items matching fuzzy query (${i}) `, () => {
        let tokenizer = new Tokenizer()
        let randomFile = fileSystem.getFile()
        let randomFilename = fspath.basename(randomFile)
        let queryParts = tokenizer.getJointTokens(randomFilename).split("|")
        for (let i = 0; i < queryParts.length; i += 2) {
            queryParts = queryParts.splice(i, 1)
        }
        let query = queryParts.join()

        let result = index.provideWorkspaceSymbols(query)

        assert.ok(result.length > 0, `No result was returned for '${randomFilename}'. FS: ${fileSystem.size}. I: ${index.size}`)
        assert.ok(result.filter(s => s.location.uri.fsPath.toLowerCase() == randomFile.toLowerCase()).length > 0, 
            `Wrong result was returned for query '${query}' generate for '${randomFilename}'. FS: ${fileSystem.size}. I: ${index.size}`)
    });
});