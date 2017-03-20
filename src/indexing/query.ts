'use strict'

import {IndexStorageEntry} from './indexStorageEntry'
import {QueryPart} from './queryPart'
import {QueryMatch} from './queryMatch'

export class Query {

    private parts: QueryPart[]
    private partIndex: Map<string, QueryPart[]>
    private matchLongKey: boolean

    constructor(query: string, matchLongKey: boolean = false) {
        this.parts = query.split("").map(ch => new QueryPart(ch))
        this.partIndex = new Map<string, QueryPart[]>()
        for (let part of this.parts) {
            if (!this.partIndex.has(part.char))
                this.partIndex.set(part.char, [])
            this.partIndex.get(part.char).push(part)
        }

        this.matchLongKey = matchLongKey
    }

    public getMatch(entry: IndexStorageEntry): QueryMatch {
        let searchKey = this.matchLongKey ? entry.longKey : entry.shortKey
        let rankKey = entry.shortKey

        let success: boolean = false
        let rank: number = -1
        if (this.checkContainsChars(searchKey)) {
            this.resetQueryParts()
            this.buildQueryParts(searchKey)
            this.filterQueryPartIndices()
            success = this.allQueryPartsNotEmpty()
            if (success) 
                rank = this.caclulateRank(searchKey, rankKey)
        }
        
        return new QueryMatch(success, rank, entry)
    }

    private checkContainsChars(data: string) {
        let index = 0
        for (let part of this.parts) {
            index = data.indexOf(part.char, index)
            if (index < 0) {
                return false
            }
        }

        return true
    }

    private resetQueryParts() {
        for (let part of this.parts)
            part.reset()
    }

    private buildQueryParts(data: string) {
        for (let i = 0; i < data.length; i++) {
            let char = data[i]

            if (this.partIndex.has(char)) {
                let matchingParts = this.partIndex.get(char)
                for (let matchingPart of matchingParts) 
                    matchingPart.addIndex(i)
            }
        }
    }

    private filterQueryPartIndices() {
        for (let i = 1; i < this.parts.length; i++) {
            let prevPart = this.parts[i - 1]
            let currentPart = this.parts[i]
            
            if (currentPart.size == 0)
                return
            currentPart.removeLesserIndices(prevPart.minIndex)
            if (currentPart.size == 0)
                return
        }

        for (let i = this.parts.length - 2; i >= 0; i--) {
            let currentPart = this.parts[i]
            let nextPart = this.parts[i + 1]
            
            if (currentPart.size == 0)
                return
            currentPart.removeGreaterIndices(nextPart.maxIndex)
            if (currentPart.size == 0)
                return
        }
    }

    private allQueryPartsNotEmpty() {
        return this.parts.length > 0 && this.parts.every(p => p.size > 0)
    }

    private caclulateRank(longKey: string, shortKey: string): number {
        let firstIndex = this.parts[0].maxIndex
        let lastIndex = this.parts[this.parts.length - 1].maxIndex
        let shortKeyIndex = longKey.length - shortKey.length - 1
        let positionRank = (firstIndex > shortKeyIndex && lastIndex > shortKeyIndex) ? 1 : 0

        let routes = []
        let indexSet = new Set<number>()
        for (let part of this.parts) {
            let newIndexSet = new Set<number>()

            for (let index of part.indices) {
                newIndexSet.add(index)
                if (indexSet.has(index - 1))
                    routes[index] = routes[index - 1] + 1
                else
                    routes[index] = 1
            }

            indexSet = newIndexSet
        }
        let maxRoute = 0;
        for (let route of routes) {
            if (route != null && route > maxRoute)
                maxRoute = route
        }
        let maxRouteRank = maxRoute / this.parts.length

        return 100 * positionRank + maxRouteRank
    }
}