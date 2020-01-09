const { EventEmitter } = require('events')
const { createServer } = require('net')
const { PromiseSocket } = require('promise-socket')
const Client = require('./network/Client')

class TCPServer extends EventEmitter {
  constructor (app) {
    super()

    this.app = app

    /**
     * Server connection
     * @type {?net.Socket}
     * @public
     */
    this.server = null

    /**
     * The connected client
     * @type {Client}
     * @public
     */
    this.client = null
  }

  /**
   * Create socket and begin listening for new connections
   * @returns {Promise<void>}
   * @public
   */
  serve () {
    return new Promise((resolve, reject) => {
      if (this.server) reject(new Error('The server has already been instantiated.'))

      this.server = createServer(socket => this._onConnection(socket))
        .once('listening', () => resolve())
        .once('error', error => reject(error))

      this.server.listen(443)
    })
  }

  /**
   * Handles new incoming connections
   * @param {net.Socket} socket Connection socket
   */
  async _onConnection (socket) {
    socket = new PromiseSocket(socket)

    this.client = new Client(this, socket)
    await this.client.connect()
  }

  /**
   * Removes the client from the connections map
   */
  removeConnection () {
    if (this.client) this.client = null
  }
}

module.exports = TCPServer
