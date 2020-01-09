const { rootPath } = require('electron-root-path')
const path = require('path')
const fs = require('fs')
const util = require('util')

/**
 * Game types
 * @type {Array}
 * @constant
 */
const GAME_TYPES = [
  'aj',
  'wild',
  'feral'
]

class PluginManager {
  constructor (app) {
    /**
     * The application that instantiated this plugin manager
     * @type {Application}
     * @public
     */
    this.app = app

    /**
     * The plugins of this plugin manager
     * @type {Map<string, Object>}
     * @public
     */
    this.plugins = new Map()

    /**
     * The commands of this plugin manager
     * @type {Map<string, Function>}
     * @public
     */
    this.commands = new Map()

    /**
     * The local hooks of this plugin manager
     * @type {Map<string, Function>}
     * @public
     */
    this.localHooks = new Map()

    /**
     * The remote hooks of this plugin manager
     * @type {Map<string, Function>}
     * @public
     */
    this.remoteHooks = new Map()

    /**
     * The path to the plugins folder
     * @type {string}
     * @public
     */
    this.folder = path.resolve(rootPath, 'plugins/')
  }

  /**
   * Validates the plugin configuration
   * @param {Object} config The specified plugin configuration
   * @static
   */
  validate (config, path) {
    if (config.name === undefined || config.description === undefined || config.game === undefined || config.author === undefined) {
      this.app.console.showMessage({
        message: `The config for the plugin in ${path} is missing required options`,
        type: 'error'
      })
    }

    if (!GAME_TYPES.includes(config.game.toLowerCase())) {
      this.app.console.showMessage({
        message: `The config for the plugin in ${path} has a invalid game type`,
        type: 'error'
      })
    }
  }

  /**
   * Opens a plugin open
   * @param {string} name The plugin to open
   */
  open (name) {
    const plugin = this.plugins.get(name)
    if (plugin) window.open(plugin.html)
  }

  /**
   * Loads all the plugins
   * @public
   */
  async loadAll () {
    const paths = await util.promisify(fs.readdir)(this.folder)

    for (const path of paths) {
      if (!(await util.promisify(fs.stat)(`${this.folder}/${path}/`)).isDirectory()) {
        continue
      }

      await this.load(path)
    }
  }

  /**
   * Loads the specified plugin
   * @param {string} path The path to the plugin
   */
  async load (path) {
    let config

    try {
      config = require(`${this.folder}/${path}/plugin.json`)
      this.validate(config, path)
    } catch (error) {
      this.app.console.showMessage({
        message: `Couldn't load the config file for the plugin in ${path} (${error.message}).`,
        type: 'error'
      })
    }

    let Plugin

    if (config.main) {
      try {
        Plugin = require(`${this.folder}/${path}/${config.main}`)
      } catch (error) {
        this.app.console.showMessage({
          message: `Couldn't find the main file for the plugin ${config.name} (${error.message}).`,
          type: 'error'
        })
      }
    }

    let html

    if (config.html) html = `${this.folder}/${path}/${config.html}`
    this.addPlugin({ config, Plugin, html })
  }

  /**
   * Adds the specified plugin to the plugins map
   * @param {Object} param The specified plugin object
   * @public
   */
  async addPlugin ({ Plugin, ...data }) {
    const object = { ...data }

    if (typeof Plugin === 'function') object.plugin = new Plugin(this.app)

    if (this.plugins.has(object.config.name)) {
      return this.app.console.showMessage({
        message: `A plugin with the name ${object.config.name} already exists!`,
        type: 'error'
      })
    }

    if (object.config.game === this.app.settings.get('game', 'aj')) {
      this.plugins.set(object.config.name, object)
      if (object.plugin) object.plugin.initialize()
    }
  }
}

module.exports = PluginManager
