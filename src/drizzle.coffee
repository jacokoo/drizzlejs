Drizzle = {}

types = ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']

for item in types
    do (item) -> Drizzle["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"


if Drizzle.isFunction(define) and define.amd
    define -> Drizzle
else if Drizzle.isObject(module) and module.exports
    module.exports = Drizzle
else
    @Drizzle = Drizzle
