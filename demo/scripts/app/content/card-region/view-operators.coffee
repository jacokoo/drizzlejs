define

    events: 'click show-*': 'showItem'

    handlers: showItem: (id) -> @module.regions.content.activate id
