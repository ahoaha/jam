const { app } = window.opener

class PacketSniffer {
  constructor () {
    /**
     * Events
     */
    app.jam.on('packet', this.onPacket.bind(this))
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
    time.className = 'time'
    time.textContent = `${this.getTime()} `
    container.appendChild(time)

    // Message
    message.textContent = `${messageData.message}`
    message.className = 'message-content'

    container.append(message)
    return container
  }

  /**
   * Shows the message
   */
  showMessage (messageData) {
    const messageElement = this.messageHTML(messageData)

    document.getElementById('packets').appendChild(messageElement)
    this.scrollToBottom(messageElement.offsetHeight)
  }

  /**
   * Scrolls to the bottom
   */
  scrollToBottom (elHeight) {
    const messageContainer = document.getElementById('packets')
    const totalScroll = messageContainer.scrollHeight - messageContainer.offsetHeight
    const currentScroll = messageContainer.scrollTop

    if (totalScroll - currentScroll <= elHeight) {
      messageContainer.scrollTop = totalScroll
    }
  }

  /**
   * Handles jam packets
   */
  onPacket (data) {
    const type = data.type
    const packet = data.packet

    this.showMessage({
      message: `${type === 'local' ? '[Animal Jam]' : '[Client]'} ${packet}`,
      type
    })
  }
}

const packetSniffer = new PacketSniffer()

/**
 * Removes the events
 */
window.addEventListener('beforeunload', () => app.jam.off('packet', packetSniffer.onPacket))
