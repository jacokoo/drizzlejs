define ['drizzle', 'app/ext/card-region'], ->

    items:
        operators: 'operators'
        'simple:item1': region: 'content', key: 'default'
        'simple:item2': region: 'content', key: 'item2'
        'simple:item3': region: 'content', key: 'item3'
        'content/todos': region: 'content', key: 'item4', isModule: true
