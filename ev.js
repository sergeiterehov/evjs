const fs = require('fs')
const util = require('util')

const { Token } = require('./token')
const { Tree } = require('./tree')
const { Compile } = require('./compile')

const source = fs.readFileSync(__dirname + '/test.ev').toString()

console.log(source)

let tokens = new Token(source).tokens

console.log(tokens)

let tree = new Tree(tokens).tree

console.log(util.inspect(tree, false, null))

let compiled = new Compile(tree).code

console.log(compiled)