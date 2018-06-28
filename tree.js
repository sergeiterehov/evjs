class TNode {
    /**
     * 
     * @param {string} operator
     * @param {Array<TNode|{ type: string, value: string }>} operands 
     */
    constructor(operator, ...operands) {
        this.operator = operator
        this.operands = operands
    }
}

class Tree {
    /**
     * @param { {type, value}[] } tokens
     */
    constructor(tokens) {
        this.tokens = tokens
        /**
         * @type {TNode[]}
         */
        this.tree = []

        this.parse()
    }

    /**
     * @param {TNode} tnode 
     */
    add(tnode) {
        this.tree.push(tnode)
    }

    parse() {
        for (let i = 0; i < 30; i++) {
            if (this.tokens.length === 0) {
                break
            }

            let operation = this.cycle()

            if (! operation) {
                continue
            }

            this.add(operation)
        }
    }

    getCurrentCodeString() {
        return this.tokens.map(token => token.value).join(' ').substr(0, 100)
    }

    cycle() {
        let t1 = this.tokens.shift()

        if (! t1) {
            throw 'Неожиданный конец файла'
        }

        if (t1.type === 'comment') {
            return new TNode('nop', t1)

        } 
        
        if (t1.type === 'id') {
            let t2 = this.tokens.shift()

            if (t2.type === 'operator') {
                if (t2.value === '=') {
                    return new TNode('assign', t1, this.cycle())

                }
            }

            this.tokens.unshift(t2)
        } 
        
        if (t1.type === 'literal' || t1.type === 'id' || t1.type === 'undefined') {
            let t2 = this.tokens.shift()

            if (t2) {
                if (t2.type === 'operator') {
                    if (t2.value === '+') {
                        return new TNode('+', t1, this.cycle())
    
                    }
                }
    
                this.tokens.unshift(t2)
            }

            return t1

        }
        
        if (t1.type === 'separator') {
            if (t1.value === ';') {
                return
            }
        }

        this.tokens.unshift(t1)

        // throw `Синтаксическая ошибка (неизвестная конструкция) "${this.getCurrentCodeString()}..."`
    }
}

module.exports.TNode = TNode
module.exports.Tree = Tree