const Plugin = require('../')

/**
 * Chat message types
 */
const MESSAGE_TYPES = [
  '0',
  '9'
]

class Copy extends Plugin {
  constructor (app) {
    super(app)

    /**
     * Copy toggle
     * @type {boolean}
     * @private
     */
    this._copy = false
  }

  /**
   * Plugin initialized
   */
  initialize () {
    this.app.commands.add('copy', {
      description: 'Copies player messages',
      execute: () => this.copy()
    })

    this.app.jam.on('remote:uc', ({ client, packet }) => this.message(client, packet))
  }

  /**
   * Follow a toggle
   * @public
   */
  copy () {
    this._copy = !this._copy
  }

  /**
   * Handles message packet
   * @param {Client} client Client instance
   * @param {Packet} packet Packet object
   * @returns {Promise<void>}
   * @public
   */
  message (client, packet) {
    const message = packet.object[5]
    const id = Number(packet.object[4])
    const type = packet.object[6]

    if (this._copy && id !== client.player.userId && MESSAGE_TYPES.includes(type)) {
      return client.player.message(message)
    }
    return null
  }
}

module.exports = Copy
