import './registerServiceWorker'
import './alert'
import '@/view-demo'

console.log('abc')

import('./sync').then(() => {
  console.log('loaded!')
})

const $root = document.getElementById('MOUNT_NODE')
$root.innerText = 'awesome!'
$root.style.cssText = 'color: blue; font-size: 24px; line-height: 2; background-color: #ccc;'
