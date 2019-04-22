import "./style.scss";

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
};

const {
  a: { c },
  e: { f }
} = obj;

// eslint-disable-next-line no-console
console.log(c, f);
