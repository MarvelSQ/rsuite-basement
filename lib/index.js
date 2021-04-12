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

var PageCreation = /*#__PURE__*/function () {
  function PageCreation(global, page) {
    _classCallCheck(this, PageCreation);

    this.global = global;
    this.page = page;
    this.components = [];
    this.dependencies = {};
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

      if (!Object.keys(relativeMap).includes(value.name)) {
        relativeMap[value.name] = {
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
      var _this = this;

      return Object.keys(props).map(function (key) {
        var value = props[key];

        if (value === 'true') {
          return key;
        }

        if (_typeof(value) === 'object') {
          return "".concat(key, "={").concat(_this.renderVarValue(value), "}");
        }

        return "".concat(key, "={").concat(value, "}");
      }).join(' ');
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(component) {
      var _component$children2,
          _this2 = this;

      var require = component.component.match(/[A-Z][^.]+/);

      if (require && !this.components.includes(require[0])) {
        this.components.push(require[0]);
      }

      this.returnValue = "<".concat(component.component).concat(component.props ? " ".concat(this.renderProps(component.props)) : '', ">").concat(((_component$children2 = component.children) === null || _component$children2 === void 0 ? void 0 : _component$children2.map(function (e) {
        if (_typeof(e) === 'object') {
          if ('component' in e) {
            return _this2.renderComponent(e);
          }

          if ('type' in e) {
            return _this2.renderVarValue(e);
          }
        }

        return e;
      }).join('')) || '', "</").concat(component.component, ">");
    }
  }, {
    key: "renderDependencies",
    value: function renderDependencies() {
      var _this3 = this;

      var components = this.components;
      components.forEach(function (comp) {
        var info = _this3.global.components[comp];

        if (_this3.dependencies[info.require]) {
          if (info.type === 'partial') {
            if (!_this3.dependencies[info.require].partial.includes(comp)) {
              _this3.dependencies[info.require].partial.push(comp);
            }
          }
        } else {
          _this3.dependencies[info.require] = {
            partial: info.type === 'partial' ? [comp] : [],
            "default": info.type === 'default' ? comp : ''
          };
        }
      });
    }
  }, {
    key: "init",
    value: function init() {
      var page = this.page;
      this.renderComponent(page.children);
      this.renderDependencies();
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
      var _this4 = this;

      var pages = this.config.pages;
      var result = pages.map(function (page) {
        return new PageCreation(_this4, page);
      });
      console.log(result);
    }
  }]);

  return Creation;
}();

function build(config) {
  var creation = new Creation(config);
  creation.build();
}

var handler = function handler(req, res, next) {
  res.send({
    message: 'success'
  });
};

exports.build = build;
exports.handler = handler;
