import registerServiceWorker from './registerServiceWorker'
import { upcase } from './libs/utils'
import './style.scss'

const $root = document.getElementById('MOUNT_NODE')
const title = upcase('Awesome Nail!')

$root.innerHTML = `
  <div class="logo"></div>
  <h1>${title}</h1>
`

registerServiceWorker()
