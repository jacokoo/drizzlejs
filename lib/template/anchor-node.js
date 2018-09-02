"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
class AnchorNode extends node_1.Node {
    constructor(id) {
        super(id);
        this.anchor = document.createComment('');
    }
    render(context) {
        super.render(context);
        if (!this.newParent) {
            this.parent.append(this.anchor);
            this.newParent = this.parent.before(this.anchor);
        }
    }
    destroy(context) {
        super.destroy(context);
        this.parent.remove(this.anchor);
        this.newParent = null;
    }
}
exports.AnchorNode = AnchorNode;
