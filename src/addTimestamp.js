function addAutor(target) {
  target.author = "OwlAford";
}

@addAutor
class Timestamp {
  constructor() {
    this.time = Date.now();
  }

  setTime() {
    const dom = document.createElement("h3");
    dom.innerHTML = `
      The current timestamp is: ${this.time}
      <br/>
      Author @${Timestamp.author}
    `;
    document.getElementById("MOUNT_NODE").appendChild(dom);
  }
}

const stamp = new Timestamp();

stamp.setTime();
