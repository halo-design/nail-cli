import registerServiceWorker from './registerServiceWorker'
import { upcase } from './libs/utils'
import txt from './nail.txt'
import './addTimestamp'
import './style.scss'
import halo from './halo.svg?inline'

import('@/asyncModule').then(() => {
  console.log('The asynchronous component is loaded.')
})

const $root = document.getElementById('MOUNT_NODE')
const title = upcase(txt)
const $context = document.createElement('div')

$context.innerHTML = `
  <div class="logo"></div>
  <h1>${title}</h1>
  <div style="display: none;">${halo}</div>
  <div class="empty"></div>
`

$root.appendChild($context)

registerServiceWorker()
