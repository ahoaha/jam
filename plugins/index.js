class Plugin {
  constructor (app) {
    /**
     * The application that instantiated this plugin
     * @type {Server}
     * @public
     */
    this.app = app
  }

  get jam () {
    return this.app.jam
  }

  /**
   * Called when the plugin has initialized
   * @returns {any}
   * @public
   */
  initialize () {
    return null
  }

  /**
   * Helper method for random
   * @param {Number} min The minimum number
   * @param {Number} max The maximum number
   * @public
   */
  random (min, max) {
    return ~~(Math.random() * (max - min + 1)) + min
  }

  /**
   * Returns the instance of the logger
   * @returns {logger}
   * @protected
   */
  get logger () {
    return this.server.logger
  }
}

module.exports = Plugin
