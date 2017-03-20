'use strict'

export class QueryPart {
    private character: string
    private matchIndices: number[]

    constructor(char: string) {
        this.character = char
        this.reset()
    }
    
    public get char() : string {
        return this.character
    }

    public get size(): number {
        return this.matchIndices.length
    }

    public get minIndex(): number {
        return this.matchIndices.length > 0 ? this.matchIndices[0] : Number.MIN_VALUE
    }

    public get maxIndex(): number {
        return this.matchIndices.length > 0 ? this.matchIndices[this.matchIndices.length - 1] : Number.MAX_VALUE
    }
    
    public get indices(): number[] {
        return this.matchIndices
    }

    public reset() {
        this.matchIndices = []
    }

    public addIndex(index: number) {
        if (this.matchIndices.length > 0 && index <= this.matchIndices[this.matchIndices.length - 1])
            throw new Error("Cannot add index that is less or equal than previously added one")

        this.matchIndices.push(index)
    }

    public removeLesserIndices(thresholdIndex: number) {
        let i
        for (i = 0; i < this.matchIndices.length; i++) {
            if (this.matchIndices[i] > thresholdIndex)
                break
        }

        this.matchIndices = this.matchIndices.slice(i)
    }

    public removeGreaterIndices(thresholdIndex: number) {
        let i
        for (i = this.matchIndices.length - 1; i >= 0; i--) {
            if (this.matchIndices[i] < thresholdIndex)
                break
        }

        this.matchIndices = this.matchIndices.slice(0, i + 1)
    }
}