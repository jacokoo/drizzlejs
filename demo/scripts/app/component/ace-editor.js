
function delay (fn, time) {
    let timeout
    return () => {
        clearTimeout(timeout)
        timeout = setTimeout(fn, time)
    }
}

export function editor(node, options = {}, code) {
    const editor = ace.edit(node, options)
    let current = code
    editor.setValue(code, -1)

    let busy = false
    const handler = delay((e) => {
        if (busy) return
        current = editor.getValue()
        node.dispatchEvent(new CustomEvent('codeChange', {detail: current}))
    }, 1)

    editor.on('change', handler)

    return {
        update (options, code) {
            console.log(code === current)
            if (code === current) return
            busy = true
            current = code
            editor.setValue(code, -1)
            busy = false
        },

        dispose () {
            editor.destroy()
        }
    }
}
