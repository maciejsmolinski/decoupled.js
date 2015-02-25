"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;
;(function (exports) {
  var Registry = (function () {
    function Registry() {
      _classCallCheck(this, Registry);
    }

    Registry.registry = {};

    _prototypeProperties(Registry, {
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

    return Registry;
  })();

  var Factory = (function () {
    function Factory(name) {
      _classCallCheck(this, Factory);

      var _Factory$classes = Factory.classes;
      var _name = name;
      if (!_hasOwn.call(_Factory$classes, _name)) _Factory$classes[_name] = (function (_Factory$BaseClass) {
        function CustomComponent() {
          _classCallCheck(this, CustomComponent);

          if (_Factory$BaseClass != null) {
            _Factory$BaseClass.apply(this, arguments);
          }
        }

        _inherits(CustomComponent, _Factory$BaseClass);

        return CustomComponent;
      })(Factory.BaseClass);

      this.componentClass = Factory.classes[name];
    }

    Factory.classes = {};

    Factory.BaseClass = function BaseClass() {
      _classCallCheck(this, BaseClass);

      this.init && this.init.apply(this, Array.from(arguments));
    };

    _prototypeProperties(Factory, {
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

    return Factory;
  })();

  var _exports = exports;
  if (!_hasOwn.call(_exports, "DC")) _exports.DC = {
    Factory: Factory,
    Registry: Registry
  };
})(undefined || global);

/**
 * Define Component
 */
DC.Factory.get("fixtures-list").init(function () {
  this.name = "fixtures-list";
}).method("last", function (resolve, reject) {
  return resolve("last");
});

/**
 * Retrieve Component, get instance, run the query
 */
DC.Factory.get("fixtures-list").instance().last().then(function (data) {
  return console.log("Result1: " + data);
});

/**
 * Do the same again
 */
DC.Factory.get("fixtures-list").instance().last().then(function (data) {
  return console.log("Result2: " + data);
});

/**
 * Add another query on the fly and query it
 */
DC.Factory.get("fixtures-list").method("recent", function (resolve, reject) {
  return resolve("recent");
}).instance().recent().then(function (data) {
  return console.log("Result3: " + data);
});
