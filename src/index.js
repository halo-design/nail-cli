import registerServiceWorker from './registerServiceWorker'
import { upcase } from './libs/utils'
import txt from 'raw-loader!./nail.txt'
import './addTimestamp'
import './style.scss'

import('@/asyncModule').then(() => {
  console.log('The asynchronous component is loaded.')
})

const $root = document.getElementById('MOUNT_NODE')
const title = upcase(txt)
const $context = document.createElement('div')

$context.innerHTML = `
  <div class="logo"></div>
  <h1>${title}</h1>
`

$root.appendChild($context)

registerServiceWorker()
