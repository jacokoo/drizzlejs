define
    adjustData: (data) ->
        data.b = 'bbb'
        data

    beforeRender: ->
        console.log 'beforeRender options'


    afterRender: ->
        console.log 'afterRender options'
