import './style.scss'

class Info {
  constructor (a) {
    this.a = a
  }

  alert () {
    alert(this.a)
  }
}

const ifn = new Info('nail')

ifn.alert()
