const { remote } = require('electron')
const Application = require('.')

const app = new Application()

app.console.showMessage({
  message: 'This is a beta release, please report any bug you may encounter to us on our <a href="https://discord.plus/jam" target="external">Discord</a> server and we will fix them, thanks. 👍',
  type: 'warn'
})

app.start()

window.addEventListener('beforeunload', () => {
  if (!remote.app.isPackaged) return

  remote.getCurrentWindow().destroy()
})

window.app = app
