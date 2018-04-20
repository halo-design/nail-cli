import registerServiceWorker from './registerServiceWorker'
import './style.scss'

const $root = document.getElementById('MOUNT_NODE')
$root.innerText = 'Awesome Nail!'
registerServiceWorker()
