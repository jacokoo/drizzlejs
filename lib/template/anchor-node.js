"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
class AnchorNode extends node_1.Node {
    constructor(id) {
        super(id);
    }
    render(context) {
        super.render(context);
        if (!this.newParent) {
            if (this.nextSibling) {
                this.anchor = document.createComment(Object.getPrototypeOf(this).constructor.name);
                this.parent.append(this.anchor);
                this.newParent = this.parent.before(this.anchor);
            }
            else {
                this.newParent = this.parent;
            }
        }
    }
    destroy(context) {
        super.destroy(context);
        if (this.anchor)
            this.parent.remove(this.anchor);
        this.newParent = null;
    }
}
exports.AnchorNode = AnchorNode;
