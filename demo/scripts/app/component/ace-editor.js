export function editor(node, options = {}, code) {
    const editor = ace.edit(node, options)
    let current = code
    editor.setValue(code, -1)

    let busy = false
    const handler = () => {
        if (busy) return
        current = editor.getValue()
        console.log(current)
        node.dispatchEvent(new CustomEvent('codeChange', {detail: current}))
    }

    editor.on('change', handler)

    return {
        update (options, code) {
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
