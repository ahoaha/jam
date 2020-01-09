const Delimiter = require('../delimiter')

class Protocol {
  constructor (client) {
    /**
     * Client that instantiated this protocol
     * @type {Client}
     * @public
     */
    this.client = client

    /**
     * Local handlers
     * @type {Object}
     * @protected
     */
    this.localHandlers = {}

    /**
     * Remote handlers
     * @type {Object}
     * @protected
     */
    this.remoteHandlers = {}

    /**
     * Local packet delimiter
     * @type {string}
     * @public
     */
    this.localDelimiter = new Delimiter(this)

    /**
     * Remote packet delimiter
     * @type {string}
     * @public
     */
    this.remoteDelimiter = new Delimiter(this)
  }

  /**
   * Connection type
   * @returns {Object}
   * @readonly
   */
  get type () {
    return {
      LOCAL: 0,
      REMOTE: 1
    }
  }

  /**
   * Packet types
   * @returns {Object}
   * @readonly
   */
  get packetType () {
    return {
      XML: 0,
      XT: 1,
      JSON: 2,
      UNDEFINED: 3
    }
  }

  /**
   * Handles incoming/outgoing packets
   * @param {number} type Packet type
   * @param {Packet} packet Incoming/outgoing packet
   */
  handle (type, packet) {
    switch (type) {
      case this.type.LOCAL:
        if (this.localHandlers[packet.type]) this.localHandlers[packet.type].handle(packet)
        break

      case this.type.REMOTE:
        if (this.remoteHandlers[packet.type]) this.remoteHandlers[packet.type].handle(packet)
        break
    }
  }

  /**
   * Handles incoming  packets and fires the events
   * @param {number} type Incoming/outgoing type
   * @param {string} packet Outgoing packet
   */
  parseAndFire (type, packet) {
    const toPacket = this.constructPacket(packet)

    if (toPacket) {
      toPacket.parse()

      this.handle(type, toPacket)

      if (type === this.type.LOCAL) {
        this.client.server.emit(`local:${toPacket.type}`, { client: this.client, packet: toPacket })

        if (toPacket.type === 'verChk' || toPacket.type === 'rndK') {
          toPacket.send = false
          this.client.remoteWrite(packet)
        }

        if (toPacket.type === 'pubMsg') {
          const [message] = toPacket.object('txt').text().split('%')

          if (message.startsWith('!')) {
            toPacket.send = false

            const params = message.split(' ').slice(1)
            const command = params.shift()

            if (!command) return

            const cmd = this.client.server.app.commands.get(command)
            if (cmd) cmd.execute({ client: this.client, params, game: true })
          }
        }
      } else {
        this.client.server.emit(`remote:${toPacket.type}`, { client: this.client, packet: toPacket })
      }

      if (toPacket.send) {
        if (type === this.type.LOCAL) this.client.remoteWrite(toPacket)
        else this.client.localWrite(toPacket)
      }
    }
  }

  /**
   * Regsiters a local handler
   * @param {string|number} event Event type
   * @param {Handler} handler Handler to regsiter
   */
  regsiterLocalHandler (event, Handler) {
    this.localHandlers[event] = new Handler(this)
  }

  /**
   * Regsiters a remote handler
   * @param {string|number} event Event type
   * @param {Handler} handler Handler to regsiter
   */
  regsiterRemoteHandler (event, Handler) {
    this.remoteHandlers[event] = new Handler(this)
  }

  /**
   * Constructs the local packet
   * @param {string} packet Packet to construct
   * @abstract
   */
  constructPacket () {
    throw new Error('Method not implemented.')
  }

  /**
   * Called on incoming/outgoing packet
   * @param {string} packet Packet to handle
   * @public
   */
  onPacket () {
    throw new Error('Method not implemented.')
  }
}

module.exports = Protocol