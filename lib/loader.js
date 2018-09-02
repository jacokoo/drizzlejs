"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Loader {
    constructor(app, path, args) {
        this._app = app;
        this._path = path;
        this._args = args;
    }
    load(file, mod) {
        return this._app.options.getResource(`${this._app.options.scriptRoot}/${this._path}/${file}`);
    }
}
exports.Loader = Loader;
