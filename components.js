"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;

var ComponentRegistry = (function () {
  function ComponentRegistry() {
    _classCallCheck(this, ComponentRegistry);
  }

  ComponentRegistry.registry = {};

  _prototypeProperties(ComponentRegistry, {
    add: {
      value: function add(name, component) {
        return this.registry[name] = component;
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(name) {
        return this.registry[name];
      },
      writable: true,
      configurable: true
    }
  });

  return ComponentRegistry;
})();

var ComponentFactory = (function () {
  function ComponentFactory(name) {
    _classCallCheck(this, ComponentFactory);

    var _ComponentFactory$classes = ComponentFactory.classes;
    var _name = name;
    if (!_hasOwn.call(_ComponentFactory$classes, _name)) _ComponentFactory$classes[_name] = (function (_ComponentFactory$BaseClass) {
      function CustomComponent() {
        _classCallCheck(this, CustomComponent);

        if (_ComponentFactory$BaseClass != null) {
          _ComponentFactory$BaseClass.apply(this, arguments);
        }
      }

      _inherits(CustomComponent, _ComponentFactory$BaseClass);

      return CustomComponent;
    })(ComponentFactory.BaseClass);

    this.componentClass = ComponentFactory.classes[name];
  }

  ComponentFactory.classes = {};

  ComponentFactory.BaseClass = function BaseClass() {
    _classCallCheck(this, BaseClass);

    this.init && this.init.apply(this, Array.from(arguments));
  };

  _prototypeProperties(ComponentFactory, {
    get: {
      value: function get() {
        return new this(Array.from(arguments));
      },
      writable: true,
      configurable: true
    }
  }, {
    init: {
      value: function init(handler) {
        this.componentClass.prototype.init = handler;

        return this;
      },
      writable: true,
      configurable: true
    },
    method: {
      value: function method(methodName, handler) {
        var _this = this;

        this.componentClass.prototype[methodName] = function () {
          return new Promise(handler.bind(_this));
        };

        return this;
      },
      writable: true,
      configurable: true
    },
    instance: {
      value: function instance() {
        return new this.componentClass();
      },
      writable: true,
      configurable: true
    }
  });

  return ComponentFactory;
})();

/**
 * Define Component
 */
ComponentFactory.get("fixtures-list").init(function () {
  this.name = "fixtures-list";
}).method("last", function (resolve, reject) {
  return resolve("last");
});

/**
 * Retrieve Component, get instance, run the query
 */
ComponentFactory.get("fixtures-list").instance().last().then(function (data) {
  return console.log("Result1: " + data);
});

/**
 * Do the same again
 */
ComponentFactory.get("fixtures-list").instance().last().then(function (data) {
  return console.log("Result2: " + data);
});

/**
 * Add another query on the fly and query it
 */
ComponentFactory.get("fixtures-list").method("recent", function (resolve, reject) {
  return resolve("recent");
}).instance().recent().then(function (data) {
  return console.log("Result3: " + data);
});
