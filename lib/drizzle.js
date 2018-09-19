"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./template/helper");
const if_block_1 = require("./template/if-block");
const each_block_1 = require("./template/each-block");
const loader_1 = require("./loader");
exports.Loader = loader_1.Loader;
const template_1 = require("./template/template");
exports.ModuleTemplate = template_1.ModuleTemplate;
exports.ViewTemplate = template_1.ViewTemplate;
const application_1 = require("./application");
exports.Application = application_1.Application;
const static_node_1 = require("./template/static-node");
const dynamic_node_1 = require("./template/dynamic-node");
const text_node_1 = require("./template/text-node");
const reference_node_1 = require("./template/reference-node");
const region_node_1 = require("./template/region-node");
const transformer_1 = require("./template/transformer");
const route_1 = require("./route");
exports.RouterPlugin = route_1.RouterPlugin;
const special_nodes_1 = require("./template/special-nodes");
const innerHelpers = {
    if: helper_1.IfHelper, unless: helper_1.UnlessHelper
};
// nodes
const SN = (name, id) => new static_node_1.StaticNode(name, id);
const DN = (name, id) => {
    if (name === 'window')
        return new special_nodes_1.WindowNode(id);
    if (name === 'app')
        return new special_nodes_1.ApplicationNode(id);
    return new dynamic_node_1.DynamicNode(name, id);
};
const REF = (name, id) => new reference_node_1.ReferenceNode(name, id);
const TX = (...ss) => new text_node_1.TextNode(...ss);
const RG = (id = 'default') => new region_node_1.RegionNode(id);
// node attribute
const SA = (d, name, value) => {
    d.attribute(name, value);
};
const DA = (d, name, ...hs) => d.dynamicAttribute(name, hs);
const BD = (d, from, to) => d.bind(from, to);
const MP = (d, from, to) => d.map(from, to);
const EV = (d, event, method, ...attrs) => {
    d.on(event, method, attrs);
};
const AC = (d, event, method, ...attrs) => {
    d.action(event, method, attrs);
};
const CO = (d, name, ...hs) => d.component(name, hs);
const C = (parent, ...children) => parent.setChildren(children);
// attributes
const TI = (name, ...args) => new transformer_1.TransformerItem(name, args);
const TV = (value, end, ...items) => [template_1.ValueType.TRANSFORMER, new transformer_1.Transformer(value, items, end)];
const SV = (v) => [template_1.ValueType.STATIC, v];
const DV = (v) => [template_1.ValueType.DYNAMIC, v];
const AT = (n, v) => [n, v];
// helpers
const H = (n) => Array.isArray(n) ? new helper_1.EchoHelper(n) : new helper_1.EchoHelper(DV(n));
const HH = (n, ...args) => {
    if (innerHelpers[n])
        return new innerHelpers[n](...args);
    return new helper_1.DelayHelper(n, ...args);
};
// block
const EACH = (args, trueNode, falseNode) => new each_block_1.EachBlock(args, trueNode, falseNode);
const IF = (args, trueNode, falseNode) => new if_block_1.IfBlock(args, trueNode, falseNode);
const UN = (n, trueNode, falseNode) => new if_block_1.UnlessBlock([DV(n)], trueNode, falseNode);
exports.factory = {
    SN, DN, TX, RG, REF, SV, DV, AT, H, HH,
    EACH, IF, UN, C, SA, DA, BD, EV, AC, CO, TI, TV, MP
};
