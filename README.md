# Folder Indexing for Visual Studio Code

This extension creates in-memory index of files in opened folder and allows user to open them quickly via `workbench.action.showAllSymbols (Go To Symbol In Workspace)` command.

## Features

* Quick open files by 
    - filename 
    - filename part 
    - fuzzy pattern (e.g. 'sod' would match '**So**meMatching**D**ataFile.txt')
* Exclude paths from indexing using glob patterns

## Settings

* `folder-indexing.exclude` : glob patterns to exclude from index
* `folder-indexing.searchResultMaxSize` : maximal number of lines to show in dropdown
* `folder-indexing.searchMode` : sets target which search is run on:
    - `filename`: find symbol matches in filename
    - `fullpath`: find symbol matches in full path (slower and less stable)

## Commands

* `folder-indexing.rebuildindex (Folder Indexing: Rebuild)` : rebuild index (e.g. if something's wrong)
