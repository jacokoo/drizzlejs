define

    events:
        'click btn': 'buttonClicked'
        'click check-*': 'checkClicked'

    bind:
        item: 'sync#render'

    handlers:
        buttonClicked: (args...) ->
            console.log args, 'args'

        checkClicked: (args...) ->
            console.log args, 'args2'
