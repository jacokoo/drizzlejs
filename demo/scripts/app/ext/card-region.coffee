define ['jquery', 'drizzle'], ($, D) ->

    class CardRegion extends D.MultiRegion
        initialize: ->
            super
            @el.addClass 'tab-content no-padding no-border'

        createElement: (key, item) ->
            el = super
            el.addClass 'tab-pane fade'
            el.addClass 'in active' if item.regionInfo.key is 'default'
            el

        activate: (item) ->
            key = if D.isString item then item else item.regionInfo?.key
            return if not key

            element = @elements[key]
            container = element.parent() #from bootstrap
            $active = container.find('> .active')
            transition = $.support.transition && $active.hasClass('fade')
            deferred = @createDeferred()

            next = ->
                $active.removeClass('active')
                element.addClass('active')

                if transition
                    element[0].offsetWidth #reflow for transition
                    element.addClass('in')
                else
                    element.removeClass('fade')
                deferred.resolve()

            if transition then $active.one($.support.transition.end, next).emulateTransitionEnd(150) else next()

            $active.removeClass('in')
            deferred

    D.Region.register 'card', CardRegion

    CardRegion
