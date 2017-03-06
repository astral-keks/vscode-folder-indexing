# Folder Indexing for Visual Studio Code

This extension creates in-memory index of files in opened folder and allows user to open them quickly via `workbench.action.showAllSymbols` (Go To Symbol In Workspace) command.

## Features

* Quick open by partial filename
* Exclude paths from indexing using glob patterns

## Settings

* `folderindexing.exclude` : glob patterns to exclude from index

## Commands

* `folderindexing.rebuildindex (Folder Indexing: Rebuild)` : rebuild index (e.g. if something's wrong)
