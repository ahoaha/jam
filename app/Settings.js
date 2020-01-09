const { rootPath } = require('electron-root-path')
const path = require('path')
const util = require('util')
const fs = require('fs')

class Settings {
  constructor () {
    /**
     * The path to the settings file
     * @type {string}
     * @public
     */
    this.path = path.resolve(rootPath, 'settings.json')

    /**
     * The settings object
     * @type {Object}
     * @public
     */
    this.settings = {}
  }

  /**
   * Loads the settings
   * @public
   */
  async load () {
    try {
      const settings = await util.promisify(fs.readFile)(this.path, 'utf-8')
      this.settings = JSON.parse(settings)
    } catch (error) {
      throw new Error(`Failed to load settings ${error.message}`)
    }
  }

  /**
   * Returns the value if the given key is found
   * @param {string} key The object key
   * @param {defaultValue} defaultValue The default value if the key isn't found
   * @returns {Object}
   */
  get (key, defaultValue = false) {
    if (this.settings.hasOwnProperty(key)) return this.settings[key]
    return defaultValue
  }
}

module.exports = Settings
