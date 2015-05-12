D.Factory =

    types: {}

    register: (type, clazz) -> @types[type] = clazz

    create: (type, args...) ->
        clazz = @types[type] or @
        new clazz args...
