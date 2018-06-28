class Node {
    constructor()
    {
        this.value = undefined
        this.refs = []
    }

    update(value) {
        this.value = value
        this.refs.forEach(ref => ref.update(value))
    }
}

module.exports.Var = class Var extends Node {
    constructor(value) {
        super()

        if (value !== undefined) {
            if (value instanceof Node) {
                this.link(value)
            } else {
                this.set(value)
            }
        }
    }
    set(value) {
        this.update(value)

        return this
    }

    link(link) {
        this.doLink(link)

        return this
    }

    doLink(link) {
        if (this.value instanceof Node) {
            let refs = [] //this.value.refs

            refs.forEach((ref, i) => {
                if (ref === this) {
                    refs.splice(i, 1)
                }
            })
        }

        link.refs.push(this)
        this.update(link.value)
    }
}

module.exports.Func = class Func extends Node {
    constructor(args, func) {
        super()

        this.args = args
        this.func = func

        args.forEach(arg => {
            if (arg instanceof Node) {
                arg.refs.push(this)
            }
        })
    }

    update(value) {
        super.update(this.func(... this.args.map(arg => {
            if (arg instanceof Node) {
                return arg.value
            }

            return arg
        })))
    }
}

module.exports.Event = class Event extends Node {
    constructor(when) {
        super()

        this.listeners = []

        when(() => this.listeners.forEach(f => f()))
    }

    then(callback) {
        this.listeners.push(callback)

        return this
    }
}