# DrizzleJS v0.2.0
# -------------------------------------
# Copyright (c) 2014 Jaco Koo <jaco.koo@guyong.in>
# Distributed under MIT license

D = Drizzle = {}

types = ['Function', 'Object', 'Array', 'Number', 'Boolean', 'Date', 'RegExp', 'Undefined', 'Null']

for item in types
    do (item) -> D["is#{item}"] = (obj) -> Object.prototype.toString.call(obj) is "[object #{item}]"

if D.isFunction(define) and define.amd
    define -> D
else if D.isObject(module) and module.exports
    module.exports = D
else
    @Drizzle = D
