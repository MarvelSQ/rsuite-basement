"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var rsuite_1 = require("rsuite");
var TablePagination_1 = __importDefault(require("rsuite/lib/Table/TablePagination"));
var headerStyles = {
    padding: 18,
    fontSize: 16,
    height: 56,
    background: '#34c3ff',
    color: ' #fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};
function UserPage() {
    var _a = react_1.useState(true), expand = _a[0], setExpand = _a[1];
    var _b = react_1.useState(''), search = _b[0], setSearch = _b[1];
    var onChange = react_1.useCallback(function () {
        setExpand(function (expand) { return !expand; });
    }, []);
    var onSearch = react_1.useCallback(function (word) {
        setSearch(word);
    }, []);
    return (react_1.default.createElement(rsuite_1.Container, { className: "page" },
        react_1.default.createElement(rsuite_1.Sidebar, { style: { display: 'flex', flexDirection: 'column' }, width: expand ? 260 : 56, collapsible: true },
            react_1.default.createElement(rsuite_1.Sidenav, { expanded: expand, defaultOpenKeys: ['3'], appearance: "subtle" },
                react_1.default.createElement(rsuite_1.Sidenav.Header, null,
                    react_1.default.createElement("div", { style: headerStyles },
                        react_1.default.createElement(rsuite_1.Icon, { icon: "logo-analytics", size: "lg", style: { verticalAlign: 0 } }),
                        react_1.default.createElement("span", { style: { marginLeft: 12 } }, " BRAND"))),
                react_1.default.createElement(rsuite_1.Sidenav.Body, null,
                    react_1.default.createElement(rsuite_1.Nav, null,
                        react_1.default.createElement(rsuite_1.Nav.Item, { eventKey: "1", icon: react_1.default.createElement(rsuite_1.Icon, { icon: "dashboard" }), componentClass: react_router_dom_1.NavLink, exact: true, to: "/" }, "Dashboard"),
                        react_1.default.createElement(rsuite_1.Nav.Item, { eventKey: "2", icon: react_1.default.createElement(rsuite_1.Icon, { icon: "group" }), componentClass: react_router_dom_1.NavLink, to: "/user" }, "User Group"),
                        react_1.default.createElement(rsuite_1.Dropdown, { eventKey: "3", trigger: "hover", title: "Advanced", icon: react_1.default.createElement(rsuite_1.Icon, { icon: "magic" }), placement: "rightStart" },
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "3-1" }, "Geo"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "3-2" }, "Devices"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "3-3" }, "Brand"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "3-4" }, "Loyalty"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "3-5" }, "Visit Depth")),
                        react_1.default.createElement(rsuite_1.Dropdown, { eventKey: "4", trigger: "hover", title: "Settings", icon: react_1.default.createElement(rsuite_1.Icon, { icon: "gear-circle" }), placement: "rightStart" },
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "4-1" }, "Applications"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "4-2" }, "Websites"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "4-3" }, "Channels"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "4-4" }, "Tags"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, { eventKey: "4-5" }, "Versions"))))),
            react_1.default.createElement(rsuite_1.Navbar, { appearance: "subtle", className: "nav-toggle" },
                react_1.default.createElement(rsuite_1.Navbar.Body, null,
                    react_1.default.createElement(rsuite_1.Nav, null,
                        react_1.default.createElement(rsuite_1.Dropdown, { placement: "topStart", trigger: "click", renderTitle: function (children) {
                                return react_1.default.createElement(rsuite_1.Icon, { icon: "cog" });
                            } },
                            react_1.default.createElement(rsuite_1.Dropdown.Item, null, "Help"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, null, "Settings"),
                            react_1.default.createElement(rsuite_1.Dropdown.Item, null, "Sign out"))),
                    react_1.default.createElement(rsuite_1.Nav, { pullRight: true },
                        react_1.default.createElement(rsuite_1.Nav.Item, { onClick: onChange, style: { width: 56, textAlign: 'center' } },
                            react_1.default.createElement(rsuite_1.Icon, { icon: expand ? 'angle-left' : 'angle-right' })))))),
        react_1.default.createElement(rsuite_1.Container, null,
            react_1.default.createElement(rsuite_1.Content, null,
                react_1.default.createElement(rsuite_1.Panel, { bodyFill: true },
                    react_1.default.createElement("div", { style: { padding: '20px' } },
                        react_1.default.createElement(rsuite_1.InputGroup, { inside: true },
                            react_1.default.createElement(rsuite_1.Input, { value: search, onChange: onSearch }),
                            react_1.default.createElement(rsuite_1.InputGroup.Button, null,
                                react_1.default.createElement(rsuite_1.Icon, { icon: "search" })))),
                    react_1.default.createElement(rsuite_1.Table, { height: window.innerHeight - 257 },
                        react_1.default.createElement(rsuite_1.Table.Column, null,
                            react_1.default.createElement(rsuite_1.Table.HeaderCell, null, "ID"),
                            react_1.default.createElement(rsuite_1.Table.Cell, { dataKey: "id" }))),
                    react_1.default.createElement(TablePagination_1.default, { lengthMenu: [
                            {
                                value: 10,
                                label: 10,
                            },
                            {
                                value: 20,
                                label: 20,
                            },
                        ], activePage: 1, displayLength: 10, total: 100 }))),
            react_1.default.createElement(rsuite_1.Footer, null))));
}
exports.default = UserPage;
