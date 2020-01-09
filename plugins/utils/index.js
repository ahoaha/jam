const Plugin = require('..')

class Utils extends Plugin {
  /**
   * Plugin initialized
   */
  initialize () {
    this.app.commands
      .add('help', {
        description: 'Displays the list of commands and their description',
        execute: ({ client, game }) => this.commandList(client, game)
      })
      .add('beta', {
        description: 'Teleports to beta den',
        execute: ({ client }) => this.betaCommand(client)
      })
      .add('remote', {
        description: 'Sends a remote packet',
        execute: ({ client, params }) => this.remoteCommand(client, params)
      })
      .add('local', {
        description: 'Sends a local packet',
        execute: ({ client, params }) => this.localCommand(client, params)
      })
  }

  /**
   * Sends the commands message
   * @param {Client} client Client instance
   * @param {string} commands The commands to send
   * @param {boolean} game Checks if the command is called from the game
   * @public
   */
  sendCommandsMessage (client, commands, game) {
    if (game) return client.serverMessage(commands)
    else this.app.console.showMessage({ message: commands, type: 'info', time: false })
  }

  /**
   * Displays the list of commands
   * @param {Client} client Client instance
   * @returns {Promise<void>}
   * @public
   */
  commandList (client, game) {
    let commands = ''

    for (const [command, value] of this.app.commandManager.commands) {
      commands += `!${command} - ${value.description} ${game ? '\n\n' : '<br />'}`
    }

    this.sendCommandsMessage(client, commands, game)
  }

  /**
   * Beta command
   * @param {Client} client Client instance
   * @public
   */
  betaCommand (client) {
    client.localWrite('%xt%rp%0%player_den.room_main%0%2%0%100%0%%')
  }

  /**
   * Remote command
   * @param {Client} client Client instance
   * @param {Array} params Command parameters
   * @public
   */
  async remoteCommand (client, params) {
    const packet = params.join(' ')

    if (packet) await client.remoteWrite(packet)
  }

  /**
   * Local command
   * @param {Client} client Client instance
   * @param {Array} params Command parameters
   * @public
   */
  async localCommand (client, params) {
    const packet = params.join(' ')

    if (packet) await client.localWrite(packet)
  }
}

module.exports = Utils
