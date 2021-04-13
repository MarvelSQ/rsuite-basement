"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var routes_1 = __importDefault(require("../routes"));
require("./index.less");
var App = function () {
    return react_1.default.createElement(routes_1.default, null);
};
react_dom_1.default.render(react_1.default.createElement(App, null), document.getElementById('root'));
