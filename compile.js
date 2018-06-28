const { TNode } = require('./tree')

module.exports.Compile = class Compile {
    /**
     * 
     * @param { Array<Node|{ type: string, value: string }> } tree 
     */
    constructor(tree) {
        this.tree = tree
        this.code = ''

        this.code = this.run()
    }

    run() {
        return this.tree.map(node => this.generate(node)).join("\n")
    }

    /**
     * @param { TNode|{ type: string, value: string } } node 
     */
    findRefs(node) {
        let names = []

        node.operands.forEach(operand => {
            if (operand instanceof TNode) {
                this.findRefs(operand).forEach(name => names.push(name))
            } else {
                if (operand.type === 'id') {
                    names.push(operand.value)
                }
            }
        })

        return Array.from(new Set(names))
    }

    /**
     * @param { TNode|{ type: string, value: string } } node 
     */
    generate(node) {
        if (node instanceof TNode) {
            if (node.operator === 'assign') {
                return `${node.operands[0].value}.set(${this.generate(node.operands[1])});`
            }

            if (node.operator === '+') {
                let refs = this.findRefs(node)

                if (refs.length > 0) {
                    return `new Func([${refs.join(', ')}], (${refs.map((name, i) => `arg${i}`).join(', ')}) => (${this.generate(node.operands[0])} + ${this.generate(node.operands[1])}))`
                }

                return `${this.generate(node.operands[0])} + ${this.generate(node.operands[1])}`
            }
        } else {
            if (node.type === 'undefined') {
                return 'undefined'
            }

            return node.value
        }
    }
}