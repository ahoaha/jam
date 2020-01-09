const { ipcRenderer } = require('electron')

const defaultMessageProps = {
  time: true
}

class Console {
  constructor (app) {
    this.app = app

    this.input = document.getElementById('input')

    this.input.addEventListener('keydown', e => {
      const keyCode = e.which

      if (keyCode === 13) {
        this.handleInput(this.input.value)
        this.input.value = ''
      }
    })
  }

  close () {
    ipcRenderer.send('window-close')
  }

  minimize () {
    ipcRenderer.send('window-minimize')
  }

  openDirectory () {
    ipcRenderer.send('open-directory')
  }

  /**
   * Gets the time
   */
  getTime () {
    const time = new Date()
    const hour = time.getHours()
    const minute = time.getMinutes()
    const timeString = `${hour}:${minute}`

    return timeString
  }

  /**
   * Handles the message html
   */
  messageHTML (messageData) {
    const container = document.createElement('div')
    const time = document.createElement('div')
    const message = document.createElement('div')

    container.className = `message ${messageData.type || ''}`

    // Time
    if (messageData.time) {
      time.className = 'time'
      time.textContent = `${this.getTime()} `
      container.appendChild(time)
    }

    // Message
    message.innerHTML = `${messageData.message}`
    message.className = 'message-content'

    container.append(message)
    return container
  }

  /**
   * Shows the message
   */
  showMessage (messageData) {
    const messageElement = this.messageHTML({ ...defaultMessageProps, ...messageData })

    document.getElementById('messages').appendChild(messageElement)
    this.scrollToBottom(messageElement.offsetHeight)
  }

  /**
   * Clears the console
   */
  clear () {
    const div = document.getElementById('messages')

    while (div.firstChild) div.removeChild(div.firstChild)
  }

  /**
   * Handles commands
   */
  handleInput (message) {
    const params = message.split(' ')
    const command = params.shift()

    const cmd = this.app.commands.get(command)
    if (cmd) cmd.execute({ client: this.app.jam.client, params })
  }

  /**
   * Scrolls to the bottom
   */
  scrollToBottom (elHeight) {
    const messageContainer = document.getElementById('messages')
    const totalScroll = messageContainer.scrollHeight - messageContainer.offsetHeight
    const currentScroll = messageContainer.scrollTop

    if (totalScroll - currentScroll <= elHeight) {
      messageContainer.scrollTop = totalScroll
    }
  }
}

module.exports = Console
