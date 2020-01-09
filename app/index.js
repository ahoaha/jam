const { app, shell, ipcMain, globalShortcut } = require('electron')
const { rootPath } = require('electron-root-path')
const Window = require('./electron/Window')
const Hosts = require('./util/Hosts')
const path = require('path')

let mainWindow
let hosts

/**
 * Creates the main window
 */
function main () {
  mainWindow = new Window({
    file: path.join(__dirname, 'electron', 'ui', 'index.html'),
    frame: false
  })

  hosts = new Hosts()
  hosts.load()

  globalShortcut.register('f11', () => mainWindow.webContents.openDevTools())
  mainWindow.webContents.on('new-window', createPluginWindow)
}

/**
 * Creates the external plugin window
 */
function createPluginWindow (event, url, frameName, _, options) {
  switch (frameName) {
    case 'external':
      event.preventDefault()
      shell.openExternal(url)
      break

    default:
      Object.assign(options, {
        height: 550,
        width: 760,
        file: url,
        frame: true,
        webPreferences: {
          nodeIntegration: true
        },
        autoHideMenuBar: true,
        alwaysOnTop: false,
        resizable: true
      })
  }
}

app.on('ready', main)
app.on('before-quit', () => {
  hosts.removeAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('window-close', () => mainWindow.close())
ipcMain.on('window-minimize', () => mainWindow.minimize())
ipcMain.on('open-directory', () => shell.openItem(rootPath))
