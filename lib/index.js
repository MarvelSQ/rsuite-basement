'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var PropsIdentifer;

(function (PropsIdentifer) {
  PropsIdentifer["CONST"] = "const";
  PropsIdentifer["PROPS"] = "props";
  PropsIdentifer["STATES"] = "states";
  PropsIdentifer["MEMOS"] = "memos";
})(PropsIdentifer || (PropsIdentifer = {}));

var Dependency = /*#__PURE__*/function () {
  function Dependency(require) {
    _classCallCheck(this, Dependency);

    this.require = require;
    this.partial = [];
    this.main = '';
  }

  _createClass(Dependency, [{
    key: "hasMember",
    value: function hasMember(name) {
      if (this.main === name) {
        return 'main';
      }

      if (this.partial.includes(name)) {
        return 'partial';
      }

      return null;
    }
  }, {
    key: "addExport",
    value: function addExport(name) {
      var isDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var type = isDefault ? 'main' : 'partial';
      var exist = this.hasMember(name);

      if (!exist) {
        if (isDefault) {
          this.main = name;
        } else {
          this.partial.push(name);
        }

        return;
      }

      if (exist !== type) {
        throw Error("required name duplicates \"".concat(name, "\" in require \"").concat(this.require, "\""));
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      var part = this.partial.join(',');
      var main = this.main;
      var split = main && part ? ',' : '';
      return "import ".concat(main).concat(split).concat(part ? "{".concat(part, "}") : '', " from '").concat(this.require, "'");
    }
  }]);

  return Dependency;
}();

var DependencyList = /*#__PURE__*/function () {
  function DependencyList() {
    _classCallCheck(this, DependencyList);

    this.dependencyMap = {};
  }

  _createClass(DependencyList, [{
    key: "checkAllMember",
    value: function checkAllMember(name) {
      var _this = this;

      var dep = null;
      Object.keys(this.dependencyMap).some(function (key) {
        if (_this.dependencyMap[key].hasMember(name)) {
          dep = _this.dependencyMap[key];
          return true;
        }
      });
      return dep;
    }
  }, {
    key: "addExport",
    value: function addExport(requireId, name, isDefault) {
      var dep = this.checkAllMember(name);

      if (dep && dep.require !== requireId) {
        throw Error("duplicates member \"".concat(name, "\" in [\"").concat(requireId, "\", \"").concat(dep.require, "\"]"));
      }

      this.dependencyMap[requireId] = this.dependencyMap[requireId] || new Dependency(requireId);
      this.dependencyMap[requireId].addExport(name, isDefault);
    }
  }, {
    key: "toString",
    value: function toString() {
      var _this2 = this;

      return Object.keys(this.dependencyMap).sort().map(function (e) {
        return _this2.dependencyMap[e].toString();
      }).join('\n');
    }
  }]);

  return DependencyList;
}();

var PageCreation = /*#__PURE__*/function () {
  function PageCreation(global, page) {
    _classCallCheck(this, PageCreation);

    this.global = global;
    this.page = page;
    this.components = [];
    this.dependencies = new DependencyList(); // react 默认引用

    this.dependencies.addExport('react', 'React', true);
    this["const"] = {};
    this.props = {};
    this.states = {};
    this.memos = {};
    this.effects = [];
    this.callbacks = [];
    this.returnValue = '';
    this.init();
  }

  _createClass(PageCreation, [{
    key: "renderVarValue",
    value: function renderVarValue(value) {
      var relativeMap = this[value.type];
      var realName = (value.name.match(/[^\d][^.]+/) || [''])[0];

      if (!Object.keys(relativeMap).includes(realName)) {
        relativeMap[realName] = {
          type: '',
          body: ""
        };
      }

      if (value.type === PropsIdentifer.PROPS) {
        return "props.".concat(value.name);
      }

      return value.name;
    }
  }, {
    key: "renderProps",
    value: function renderProps(props) {
      var _this3 = this;

      return Object.keys(props).map(function (key) {
        var value = props[key];

        if (value === 'true') {
          return key;
        }

        if (_typeof(value) === 'object') {
          return "".concat(key, "={").concat(_this3.renderVarValue(value), "}");
        }

        return "".concat(key, "={").concat(value, "}");
      }).join(' ');
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(component) {
      var _component$children,
          _this4 = this;

      var require = component.component.match(/[A-Z][^.]+/);

      if (require && !this.components.includes(require[0])) {
        this.components.push(require[0]);
      }

      return "<".concat(component.component).concat(component.props ? " ".concat(this.renderProps(component.props)) : '', ">").concat(((_component$children = component.children) === null || _component$children === void 0 ? void 0 : _component$children.map(function (e) {
        if (_typeof(e) === 'object') {
          if ('component' in e) {
            return _this4.renderComponent(e);
          }

          if ('type' in e) {
            return "{".concat(_this4.renderVarValue(e), "}");
          }
        }

        return e;
      }).join('')) || '', "</").concat(component.component, ">");
    }
  }, {
    key: "renderDependencies",
    value: function renderDependencies() {
      var _this5 = this;

      var components = this.components;
      components.forEach(function (comp) {
        var info = _this5.global.components[comp];

        _this5.dependencies.addExport(info.require, comp, info.type === 'default');
      });
    }
  }, {
    key: "init",
    value: function init() {
      var page = this.page;
      this.returnValue = this.renderComponent(page.children);
      this.renderDependencies();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.dependencies.toString(), "\nfunction ").concat(this.page.name, "(props){\n\nreturn ").concat(this.returnValue, ";\n}\n\nexport default ").concat(this.page.name);
    }
  }]);

  return PageCreation;
}();

var Creation = /*#__PURE__*/function () {
  function Creation(config) {
    _classCallCheck(this, Creation);

    this.config = config;
    this.components = config.components;
  }

  _createClass(Creation, [{
    key: "buildPage",
    value: function buildPage() {}
  }, {
    key: "build",
    value: function build() {
      var _this6 = this;

      var pages = this.config.pages;
      var result = pages.map(function (page) {
        return new PageCreation(_this6, page);
      });
      return result;
    }
  }]);

  return Creation;
}();

function build(config) {
  var creation = new Creation(config);
  return creation.build();
}

var handler = function handler(req, res, next) {
  res.send({
    message: 'success'
  });
};

exports.build = build;
exports.handler = handler;
