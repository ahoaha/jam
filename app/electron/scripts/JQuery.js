/**
 * Handles plugins
 */
$(function () {
  $('#pluginsModal').on('show.bs.modal', () => {
    if (app.pluginManager.plugins.size <= 0) {
      return $('.plugin-container')
        .html('<div class="text-center">The plugin directory is empty</div>')
    }

    app.pluginManager.plugins
      .forEach(plugin => {
        $('.plugin-container')
          .append(`
          <div class="card">
            <div class="card-body">
            <h6 class="card-title">${plugin.config.name}</h6>
            <p class="card-subtitle mb-2 text-muted">By ${plugin.config.author}</p>
            <p class="card-text">${plugin.config.description}</p>
  
            <div class="float-right">
              ${plugin.config.html !== undefined ? `<a href="#" onClick="app.pluginManager.open('${plugin.config.name}')"><i class="fal fa-external-link"></i></a>` : ''}
            </div>
            </div>
          </div>
        `)
      })
  })

  $('#pluginsModal').on('hide.bs.modal', () => {
    $('.plugin-container').empty()
  })
})

/**
 * Plugin search
 */
$(function () {
  $('#search').on('keyup', function () {
    const value = this.value.toLowerCase().trim()
    $('div.card').show().filter(function () {
      return $(this).text().toLowerCase().trim().indexOf(value) === -1
    }).hide()
  })
})

/**
 * Auto complete
 */
app.once('ready', () => {
  $(function () {
    $('#input').autocomplete({
      source: Array.from(app.commandManager.commands.values())
        .map(command => ({ value: command.name, item: command.description })),
      position: { collision: 'flip' }
    }).data('ui-autocomplete')._renderItem = function (ul, item) {
      return $('<li>')
        .data('ui-autocomplete-item', item)
        .append(`<a>${item.value}</a> <a class="float-right description">${item.item}</a>`)
        .appendTo(ul)
    }
  })
})
