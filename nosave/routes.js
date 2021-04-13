"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var pages_1 = __importDefault(require("./pages"));
var User_1 = __importDefault(require("./pages/User"));
function Routes() {
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: "/", component: pages_1.default, exact: true }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/user", component: User_1.default }))));
}
exports.default = Routes;
