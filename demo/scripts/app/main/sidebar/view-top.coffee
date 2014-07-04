define

    bind: top: ''

    events:
        'click item-*': 'menuItemClicked'

    handlers:
        menuItemClicked: (id, e) ->
            @module.layout.$$('li.active').removeClass('active')
            @$("item-#{id}").parent().addClass('active')
            console.log 'click event, id:', id, e
