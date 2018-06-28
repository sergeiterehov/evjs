const {Var, Func, Event} = require('./platform')

/*

fio = 'Oleg'
fioOther = ??

name = fio
helloName = 'Hello, ' + name + '!'

console.log(helloName)

fio = 'Ivan'
fio = 'Alex'
name = fioOther
fioOther = 'Other name'

timeEvent = @ setTimeout(timeEvent, 2000)

fioOther = 'Time' @ timeEvent



*/

// fio = 'Oleg'
let fio = new Var('Oleg')
// fioOther = ??
let fioOther = new Var

// name = fio
let name = new Var(fio)
// helloName = 'Hello, ' + name + '!'
let helloName = new Func([name], (arg1) => 'Hello, ' + arg1 + '!')

// console.log(helloName)
new Func([helloName], (arg1) => console.log(arg1))

// fio = 'Ivan'
fio.set('Ivan')

// fio = 'Alex'
fio.set('Alex')

// name = fioOther
name.link(fioOther)

// fioOther = 'Other name'
fioOther.set('Other name')

// timeEvent = @ setTimeout(timeEvent, 2000)
let timeEvent = new Event((event) => setTimeout(event, 2000))

// fioOther = 'Time' @ timeEvent
timeEvent.then(() => fioOther.set('Time'))