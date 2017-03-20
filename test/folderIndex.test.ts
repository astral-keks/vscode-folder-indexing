'use strict'
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fspath from 'path'

import {FileSystemMock} from './mocks/fileSystemMock'
import {IndexStorageSettings} from '../src/indexing/indexStorageSettings'
import {IndexStorage} from '../src/indexing/indexStorage'

suite("folder index", function() {
    this.timeout(3600000)
    let testCount = 10

    let fileSystem: FileSystemMock
    let settings: IndexStorageSettings
    let index: IndexStorage

    setup(done => {
        fileSystem = new FileSystemMock()
        settings = new IndexStorageSettings()
        index = new IndexStorage(fileSystem.rootFolder, fileSystem, settings)
        index.rebuild().then(value => {
            done()
        })
    })

    teardown(() => {
        fileSystem.dispose()
        index.dispose()
    })

    for (let i = 0; i < testCount; i++)
    test(`should have the same size as file system mock (${i})`, () => {
        assert.equal(index.size, fileSystem.size, 
            `Index size is ${index.size}. File system mock size is ${fileSystem.size}`)
    });
});