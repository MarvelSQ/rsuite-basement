"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.build = void 0;
var type_1 = require("./type");
var Dependency = /** @class */ (function () {
    function Dependency(require) {
        this.require = require;
        this.partial = [];
        this.main = '';
    }
    Dependency.prototype.hasMember = function (name) {
        if (this.main === name) {
            return 'main';
        }
        if (this.partial.includes(name)) {
            return 'partial';
        }
        return null;
    };
    Dependency.prototype.addExport = function (name, isDefault) {
        if (isDefault === void 0) { isDefault = false; }
        var type = isDefault ? 'main' : 'partial';
        var exist = this.hasMember(name);
        if (!exist) {
            if (isDefault) {
                this.main = name;
            }
            else {
                this.partial.push(name);
            }
            return;
        }
        if (exist !== type) {
            throw Error("required name duplicates \"" + name + "\" in require \"" + this.require + "\"");
        }
    };
    Dependency.prototype.toString = function () {
        var part = this.partial.join(',');
        var main = this.main;
        var split = main && part ? ',' : '';
        return "import " + main + split + (part ? "{" + part + "}" : '') + " from '" + this.require + "'";
    };
    return Dependency;
}());
var DependencyList = /** @class */ (function () {
    function DependencyList() {
        this.dependencyMap = {};
    }
    DependencyList.prototype.checkAllMember = function (name) {
        var _this = this;
        var dep = null;
        Object.keys(this.dependencyMap).some(function (key) {
            if (_this.dependencyMap[key].hasMember(name)) {
                dep = _this.dependencyMap[key];
                return true;
            }
        });
        return dep;
    };
    DependencyList.prototype.addExport = function (requireId, name, isDefault) {
        var dep = this.checkAllMember(name);
        if (dep && dep.require !== requireId) {
            throw Error("duplicates member \"" + name + "\" in [\"" + requireId + "\", \"" + dep.require + "\"]");
        }
        this.dependencyMap[requireId] =
            this.dependencyMap[requireId] || new Dependency(requireId);
        this.dependencyMap[requireId].addExport(name, isDefault);
    };
    DependencyList.prototype.toString = function () {
        var _this = this;
        return Object.keys(this.dependencyMap)
            .sort()
            .map(function (e) { return _this.dependencyMap[e].toString(); })
            .join('\n');
    };
    return DependencyList;
}());
var PageCreation = /** @class */ (function () {
    function PageCreation(global, page) {
        this.global = global;
        this.page = page;
        this.components = [];
        this.dependencies = new DependencyList();
        this.const = {};
        this.props = {};
        this.states = {};
        this.memos = {};
        this.effects = [];
        this.callbacks = [];
        this.returnValue = '';
        this.init();
    }
    PageCreation.prototype.renderVarValue = function (value) {
        var relativeMap = this[value.type];
        if (!Object.keys(relativeMap).includes(value.name)) {
            relativeMap[value.name] = {
                type: '',
                body: "",
            };
        }
        if (value.type === type_1.PropsIdentifer.PROPS) {
            return "props." + value.name;
        }
        return value.name;
    };
    PageCreation.prototype.renderProps = function (props) {
        var _this = this;
        return Object.keys(props)
            .map(function (key) {
            var value = props[key];
            if (value === 'true') {
                return key;
            }
            if (typeof value === 'object') {
                return key + "={" + _this.renderVarValue(value) + "}";
            }
            return key + "={" + value + "}";
        })
            .join(' ');
    };
    PageCreation.prototype.renderComponent = function (component) {
        var _this = this;
        var _a;
        var require = component.component.match(/[A-Z][^.]+/);
        if (require && !this.components.includes(require[0])) {
            this.components.push(require[0]);
        }
        return "<" + component.component + (component.props ? " " + this.renderProps(component.props) : '') + ">" + (((_a = component.children) === null || _a === void 0 ? void 0 : _a.map(function (e) {
            if (typeof e === 'object') {
                if ('component' in e) {
                    return _this.renderComponent(e);
                }
                if ('type' in e) {
                    return _this.renderVarValue(e);
                }
            }
            return e;
        }).join('')) || '') + "</" + component.component + ">";
    };
    PageCreation.prototype.renderDependencies = function () {
        var _this = this;
        var components = this.components;
        components.forEach(function (comp) {
            var info = _this.global.components[comp];
            _this.dependencies.addExport(info.require, comp, info.type === 'default');
        });
    };
    PageCreation.prototype.init = function () {
        var page = this.page;
        this.returnValue = this.renderComponent(page.children);
        this.renderDependencies();
    };
    PageCreation.prototype.toString = function () {
        return this.dependencies.toString() + "\nfunction " + this.page.name + "(props){\n\nreturn " + this.returnValue + ";\n}";
    };
    return PageCreation;
}());
type_1.PropsIdentifer.CONST, type_1.PropsIdentifer.PROPS, type_1.PropsIdentifer.STATES, type_1.PropsIdentifer.MEMOS;
var Creation = /** @class */ (function () {
    function Creation(config) {
        this.config = config;
        this.components = config.components;
    }
    Creation.prototype.buildPage = function () { };
    Creation.prototype.build = function () {
        var _this = this;
        var pages = this.config.pages;
        var result = pages.map(function (page) { return new PageCreation(_this, page); });
        return result;
    };
    return Creation;
}());
function build(config) {
    var creation = new Creation(config);
    return creation.build();
}
exports.build = build;
var handler = function (req, res, next) {
    res.send({
        message: 'success',
    });
};
exports.handler = handler;
