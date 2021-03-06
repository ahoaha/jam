const Handler = require('../')

class Remote extends Handler {
  handle (packet) {
    const information = packet.object.b.o.params

    this.client.server.app.console.showMessage({
      message: `Successfully logged in as ${information.userName}`,
      type: 'info'
    })

    this.client.constructPlayer(information)
  }
}

module.exports = Remote
