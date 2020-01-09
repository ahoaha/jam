const Plugin = require('../')

class Color extends Plugin {
  constructor (app) {
    super(app)

    /**
     * Color interval
     * @type {?Interval}
     * @private
     */
    this._interval = null
  }

  /**
   * Plugin initialized
   */
  initialize () {
    this.app.commands.add('color', {
      description: 'Changes your avatar color',
      execute: ({ client }) => this.colorCommand(client)
    })
  }

  /**
   * Sends the color packet
   * @param {Client} client The client instance
   * @public
   */
  async color (client) {
    const randomOne = this.random(1019311667, 4348810240)
    const randomTwo = this.random(1019311667, 4348810240)

    client.remoteWrite(`%xt%o%ap%4203%${randomOne}%${randomTwo}%${randomOne}%0%`)
  }

  /**
   * Glow command
   * @param {Client} client The client instance
   * @public
   */
  colorCommand (client) {
    if (this._interval) {
      this.clear(client, this._interval)
      return
    }

    this._interval = client.setInterval(() => this.color(client), 600)
    client.serverMessage('Only other players will be able to see your colors.')
  }

  /**
   * Clears an interval
   * @param {Client} client Client instance
   * @param {Timeout} interval Interval to clear
   */
  clear (client, interval) {
    client.clearInterval(interval)
    this._interval = null
  }
}

module.exports = Color
