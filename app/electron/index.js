const electron = require('electron')
const { EventEmitter } = require('events')
const Console = require('./scripts/Console')
const PluginManager = require('../plugin/PluginManager')
const CommandManager = require('../plugin/CommandManager')
const Settings = require('../Settings')
const Hosts = require('../util/Hosts')
const Jam = require('../jam')

class Application extends EventEmitter {
  constructor () {
    super()

    /**
     * The electron instance that can be used to easily access electron
     * @type {election.Remote}
     * @public
     */
    this.electron = electron.remote

    /**
     * The plugins manager of this application
     * @type {PluginManager}
     * @public
     */
    this.pluginManager = new PluginManager(this)

    /**
     * The command handler of this application
     * @type {CommandManager}
     * @public
     */
    this.commandManager = new CommandManager(this)

    /**
     * The console of this application
     * @type {Console}
     * @public
     */
    this.console = new Console(this)

    /**
     * The server of this application
     * @type {Jam}
     * @public
     */
    this.jam = new Jam(this)

    /**
     * The settings of this application
     * @type {Settings}
     * @public
     */
    this.settings = new Settings(this)
  }

  /**
   * Getter for the command manager
   * @readonly
   */
  get commands () {
    return this.commandManager
  }

  /**
   * Starts the application
   * @public
   */
  async start () {
    this.console.showMessage({
      message: 'Initializing Ares...',
      type: 'general'
    })

    try {
      this.console.showMessage({
        message: 'Loading plugins...',
        type: 'general'
      })

      await this.pluginManager.loadAll()

      this.console.showMessage({
        message: 'Loading settings...',
        type: 'general'
      })

      await this.settings.load()
      await this.jam.serve()

      this.console.showMessage({
        message: 'Successfully initialized!',
        type: 'general'
      })

      this.emit('ready')
    } catch (error) {
      this.console.showMessage({
        message: `Failed Initializing ${error.message}`,
        type: 'error'
      })
    }
  }
}

module.exports = Application
