"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ps = [
    ['accept', 0, ['form', 'input']],
    ['accept-charset', 'acceptCharset', ['form']],
    ['accesskey', 'accessKey', 0],
    ['action', 0, ['form']],
    ['align', 0, [
            'applet', 'caption', 'col', 'colgroup', 'hr', 'iframe',
            'img', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
        ]
    ],
    ['allowfullscreen', 'allowFullscreen', ['iframe']],
    ['alt', 0, ['applet', 'area', 'img', 'input']],
    ['async', 0, ['script']],
    ['autocomplete', 0, ['form', 'input']],
    ['autofocus', 0, ['button', 'input', 'keygen', 'select', 'textarea']],
    ['autoplay', 0, ['audio', 'video']],
    ['autosave', 0, ['input']],
    ['bgcolor', 'bgColor', ['body', 'col', 'colgroup', 'marquee', 'table', 'tbody', 'tfoot', 'td', 'th', 'tr']],
    ['border', 0, ['img', 'object', 'table']],
    ['buffered', 0, ['audio', 'video']],
    ['challenge', 0, ['keygen']],
    ['charset', 0, ['meta', 'script']],
    ['checked', 0, ['command', 'input']],
    ['cite', 0, ['blockquote', 'del', 'ins', 'q']],
    ['class', 'className', 0],
    ['code', 0, ['applet']],
    ['codebase', 'codeBase', ['applet']],
    ['color', 0, ['basefont', 'font', 'hr']],
    ['cols', 0, ['textarea']],
    ['colspan', 'colSpan', ['td', 'th']],
    ['content', 0, ['meta']],
    ['contenteditable', 'contentEditable', 0],
    ['contextmenu', 0, 0],
    ['controls', 0, ['audio', 'video']],
    ['coords', 0, ['area']],
    ['data', 0, ['object']],
    ['datetime', 'dateTime', ['del', 'ins', 'time']],
    ['default', 0, ['track']],
    ['defer', 0, ['script']],
    ['dir', 0, 0],
    ['dirname', 'dirName', ['input', 'textarea']],
    ['disabled', 0, ['button', 'command', 'fieldset', 'input', 'keygen', 'optgroup', 'option', 'select', 'textarea']],
    ['download', 0, ['a', 'area']],
    ['draggable', 0, 0],
    ['dropzone', 0, 0],
    ['enctype', 0, ['form']],
    ['for', 'htmlFor', ['label', 'output']],
    ['form', 0, [
            'button', 'fieldset', 'input', 'keygen', 'label',
            'meter', 'object', 'output', 'progress', 'select', 'textarea'
        ]
    ],
    ['formaction', 0, ['input', 'button']],
    ['headers', 0, ['td', 'th']],
    ['height', 0, ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']],
    ['hidden', 0, 0],
    ['high', 0, ['meter']],
    ['href', 0, ['a', 'area', 'base', 'link']],
    ['hreflang', 0, ['a', 'area', 'link']],
    ['http-equiv', 'httpEquiv', ['meta']],
    ['icon', 0, ['command']],
    ['id', 0, 0],
    ['indeterminate', 0, ['input']],
    ['ismap', 'isMap', ['img']],
    ['itemprop', 0, 0],
    ['keytype', 0, ['keygen']],
    ['kind', 0, ['track']],
    ['label', 0, ['track']],
    ['lang', 0, 0],
    ['language', 0, ['script']],
    ['loop', 0, ['audio', 'bgsound', 'marquee', 'video']],
    ['low', 0, ['meter']],
    ['manifest', 0, ['html']],
    ['max', 0, ['input', 'meter', 'progress']],
    ['maxlength', 'maxLength', ['input', 'textarea']],
    ['media', 0, ['a', 'area', 'link', 'source', 'style']],
    ['method', 0, ['form']],
    ['min', 0, ['input', 'meter']],
    ['multiple', 0, ['input', 'select']],
    ['muted', 0, ['audio', 'video']],
    ['name', 0, [
            'button', 'form', 'fieldset', 'iframe', 'input', 'keygen',
            'object', 'output', 'select', 'textarea', 'map', 'meta', 'param'
        ]
    ],
    ['novalidate', 'noValidate', ['form']],
    ['open', 0, ['details']],
    ['optimum', 0, ['meter']],
    ['pattern', 0, ['input']],
    ['ping', 0, ['a', 'area']],
    ['placeholder', 0, ['input', 'textarea']],
    ['poster', 0, ['video']],
    ['preload', 0, ['audio', 'video']],
    ['radiogroup', 0, ['command']],
    ['readonly', 'readOnly', ['input', 'textarea']],
    ['rel', 0, ['a', 'area', 'link']],
    ['required', 0, ['input', 'select', 'textarea']],
    ['reversed', 0, ['ol']],
    ['rows', 0, ['textarea']],
    ['rowspan', 'rowSpan', ['td', 'th']],
    ['sandbox', 0, ['iframe']],
    ['scope', 0, ['th']],
    ['scoped', 0, ['style']],
    ['seamless', 0, ['iframe']],
    ['selected', 0, ['option']],
    ['shape', 0, ['a', 'area']],
    ['size', 0, ['input', 'select']],
    ['sizes', 0, ['link', 'img', 'source']],
    ['span', 0, ['col', 'colgroup']],
    ['spellcheck', 0, 0],
    ['src', 0, ['audio', 'embed', 'iframe', 'img', 'input', 'script', 'source', 'track', 'video']],
    ['srcdoc', 0, ['iframe']],
    ['srclang', 0, ['track']],
    ['srcset', 0, ['img']],
    ['start', 0, ['ol']],
    ['step', 0, ['input']],
    ['summary', 0, ['table']],
    ['tabindex', 'tabIndex', 0],
    ['target', 0, ['a', 'area', 'base', 'form']],
    ['title', 0, 0],
    ['type', 0, ['button', 'command', 'embed', 'object', 'script', 'source', 'style', 'menu']],
    ['usemap', 'useMap', ['img', 'input', 'object']],
    ['value', 0, ['button', 'option', 'input', 'li', 'meter', 'progress', 'param', 'select', 'textarea']],
    ['volume', 0, ['audio', 'video']],
    ['width', 0, ['canvas', 'embed', 'iframe', 'img', 'input', 'object', 'video']],
    ['wrap', 0, ['textarea']]
];
const attributes = ps.reduce((acc, item) => {
    acc[item[0]] = {
        name: item[1],
        tags: item[2] && item[2].reduce((ac, i) => {
            ac[i] = true;
            return ac;
        }, {})
    };
    return acc;
}, {});
// TODO set style, data set
function setAttribute(el, name, value) {
    const n = name.toLowerCase();
    const t = el.tagName.toLowerCase();
    if (attributes[n] && attributes[name].tags[t]) {
        el[attributes[n].name || n] = value;
    }
    else {
        el.setAttribute(name, value);
    }
}
exports.setAttribute = setAttribute;
