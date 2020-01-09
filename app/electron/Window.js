const { BrowserWindow } = require('electron')
const path = require('path')

const defaultProps = {
  title: 'Jam',
  fullscreenable: false,
  backgroundColor: '#16171f',
  resizable: false,
  useContentSize: true,
  width: 840,
  height: 545,
  protocol: 'file',
  slashes: true,
  webPreferences: {
    webSecurity: false,
    webviewTag: true,
    nativeWindowOpen: true,
    nodeIntegration: true
  },
  icon: path.join(__dirname, 'assets', 'icon.png')
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    super({ ...defaultProps, ...windowSettings })

    this.loadFile(file)

    this.once('ready-to-show', () => this.show())
    this.setMenu(null)
  }
}

module.exports = Window
