'use strict'

export class Tokenizer {
    private upperCaseReplaceRegex: RegExp
    private separatorsReplaceRegex: RegExp
    
    constructor() {
        this.upperCaseReplaceRegex = new RegExp("([A-Z])", "g")
        this.separatorsReplaceRegex = new RegExp("([ ~`!@#$%\\^&\\()\\-_=+{}[\\]'.;\\\\/]\\|?)", "g")        
    }

    public getSeparatedTokens(path: string): string {
        return this.trim(path
            .replace(this.upperCaseReplaceRegex, "|$1")
            .replace(this.separatorsReplaceRegex, "|")
            .toLowerCase())
    }

    public getJointTokens(path: string): string {
        return this.trim(path
            .replace(this.upperCaseReplaceRegex, "|$1")
            .replace(this.separatorsReplaceRegex, "|")
            .replace("|", "")
            .toLowerCase())
    }

    private trim(input: string): string {
        let output = input.trim()
        if (output.startsWith("|"))
            output = output.slice(1)
        if (output.endsWith("|"))
            output = output.slice(0, output.length - 1)
        return output
    }
}