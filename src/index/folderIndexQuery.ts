'use strict'

export default class FolderIndexQuery {

    private query: string[][]
    private maxSplittableQuerySize = 8

    constructor(query: string) {
        this.query = this.prepareQuery(query)
    }

    public isMatch(data: string) {
        return this.query.length > 0 && this.query.some(q => this.isMatchSplit(data, q))
    }

    private isMatchSplit(data: string, querySplit: string[]) {
        let querySplitPart = querySplit[0];
        let matchCase = this.hasUpperCase(querySplitPart)
        let preparedData = this.prepareData(data, !matchCase)
        let index = preparedData.indexOf(querySplitPart)
        if (index < 0)
            return false
        if (index >= 0 && querySplit.length == 1)
            return true

        let restData = data.substring(index + querySplitPart.length)
        return this.isMatchSplit(restData, querySplit.slice(1))
    }

    private splitQuery(query: string, firstPartSize: number): string[][] {
        let result: string[][] = []

        let firstPart = query.substr(0, firstPartSize)
        let restPart = query.substr(firstPartSize)

        let split: string[] = []        
        if (firstPart.length > 0)
            split.push(firstPart)
        if (restPart.length > 0)
            split.push(restPart)
        if (split.length > 0)
            result.push(split)

        for (var size = 1; size < restPart.length; size++) {
            let subsplits = this.splitQuery(restPart, size)

            for (var subsplit of subsplits) {
                let split: string[] = []
                
                if (firstPart.length > 0)
                    split.push(this.capitalize(firstPart))
                for (var subquerySplitPart of subsplit) 
                    split.push(this.capitalize(subquerySplitPart))

                result.push(split)
            }
        }
        
        return result
    }

    private hasUpperCase(str: string): boolean {
        return /[A-Z]/.test(str)
    }

    private prepareQuery(query: string): string[][] {
        if (query == undefined || query == null)
            query = ""
        if (query.length > 0 && query.length <= this.maxSplittableQuerySize)
            return this.splitQuery(query, 0)
        if (query.length > 0)
            return [[query]]
        return []
    }

    private prepareData(data: string, lowerCase: boolean): string {
        if (data == undefined || data == null)
            data = ""
        if (lowerCase)
            data = data.toLowerCase()
        return data
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}