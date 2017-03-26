# Folder Indexing for Visual Studio Code

This extension creates in-memory index of files in opened folder and allows user to open them via `workbench.action.showAllSymbols (Go To Symbol In Workspace)` command. For folders containing big number of files it works much faster than standard VS Code feature `workbench.action.quickOpen`.

## Features

* Quick open files by 
    - filename 
    - filename part 
    - fuzzy pattern (e.g. 'sod' would match '**So**meMatching**D**ataFile.txt')
* Exclude paths from indexing using glob patterns
* Disable index search for specific languages

## Settings

* `folder-indexing.exclude` : glob patterns to exclude from index
* `folder-indexing.searchResultMaxSize` : maximal count of lines to show in symbol search dropdown
* `folder-indexing.searchMode` : sets target which index search is performed on:
    - `filename`: find symbol matches in filename
    - `fullpath`: find symbol matches in full path (slower and less stable)
* `folder-indexing.searchDisablingLanguages` : active text editor language ids for which index search should be disabled

## Commands

* `folder-indexing.rebuildindex (Folder Indexing: Rebuild)` : rebuild index (e.g. if something's wrong)
