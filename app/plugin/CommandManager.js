class CommandManager {
  constructor (app) {
    /**
     * The application that instantiated this command handler
     * @type {Application}
     * @public
     */
    this.app = app

    /**
     * The commands of this command hander
     * @type {Map<string, Object>}
     */
    this.commands = new Map()
  }

  /**
   * Adds a command
   * @param {string} name The command name
   * @param {Object} param The command object properties
   */
  add (name, { description, execute }) {
    if (typeof name !== 'string') throw new Error('The command name type must be a string.')
    if (typeof description !== 'string') throw new Error('The command description type must be a string.')
    if (typeof execute !== 'function') throw new Error('The command callback type must be a function.')

    if (!this.commands.has(name)) this.commands.set(name, { name, description, execute })
    return this
  }

  /**
   * Gets a command
   * @param {string} name The command name
   * @public
   */
  get (name) {
    return this.commands.get(name)
  }

  /**
   * Removes a command
   * @param {string} name The command to remove
   */
  remove (name) {
    if (this.commands.has(name)) this.commands.delete(name)
  }
}

module.exports = CommandManager
