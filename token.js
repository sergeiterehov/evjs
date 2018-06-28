const lexemDefine = {
    space: /\s+/s,
    comment: {
        singleline: /\/\/(?<text>.*)/,
        multiline: /\/\*(?<text>.*)\*\//s
    },
    identifier: /[_\w]+[_\d\w]*/,
    undefined: /\?\?/,
    literal: {
        string: /'(?<content>[^'\\']*)'/,
        number: /-?[0-9]+(\.[0-9]+(e-?[0-9]+)?)?/,
        boolean: /true|false/,
    },
    keyword: /@/,
    operator: /=|>|<|!=|!>|!<|>=|<=|==|===|!==|<<|\+|-|\*|\*\*|\\|%|&|\||&&|\|\||\^|!/,
    separator: /[\.,;(){}\[\]]/,
}

module.exports.Token = class Token {
    /**
     * @param {string} source 
     */
    constructor(source) {
        this.text = source
        this.tokens = []

        this.parse()
    }

    parse() {
        while(true) {
            let found = 
                this.find('comment', lexemDefine.comment.singleline, 'text') ||
                this.find('comment', lexemDefine.comment.multiline, 'text') ||
                this.find('id', lexemDefine.identifier) ||
                this.find('literal', lexemDefine.literal.string) ||
                this.find('literal', lexemDefine.literal.boolean) ||
                this.find('literal', lexemDefine.literal.number) ||
                this.find('undefined', lexemDefine.undefined) ||
                this.find('keyword', lexemDefine.keyword) ||
                this.find('operator', lexemDefine.operator) ||
                this.find('separator', lexemDefine.separator) ||
                null;
        
            if (! found) {
                if (this.text.length > 0) {
                    throw `Лексическая ошибка (неизвестная лексема) "${this.text.substr(0, 100)}..."`
                }
        
                break
            }
        
            this.tokens.push(found)
        }
    }

    /**
     * @param {RegExp} rule 
     * @param {string} group
     */
    findAndClear(rule, group) {
        let found = rule.exec(this.text)

        if (! found || found.index > 0) {
            return null
        }

        let result = group ? found.groups[group] : found[0]

        if (undefined === result) {
            return null
        }

        this.text = this.text.substr(found[0].length)

        return result
    }

    /**
     * @param {string} type
     * @param {RegExp} rule
     * @param {string} group
     */
    find(type, rule, group = null) {
        this.findAndClear(lexemDefine.space)

        let result = this.findAndClear(rule, group)

        if (! result) {
            return null
        }

        return {
            type: type,
            value: result
        }
    }
}