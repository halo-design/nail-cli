console.log('I\'m sync!')

function addDate (target) {
  target.date = Date.now()
}

@addDate
class Foo {
  constructor () {
    this.name = 'foo'
  }
}

console.log(Foo.date)
