const obj = {
  a: {
    b: 1,
    c: 2,
    d: 3
  },
  e: {
    f: {
      g: 4
    }
  }
}

const { a: { c }, e: { f } } = obj

console.log(c, f)
console.log('view demo!')
