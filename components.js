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
          this.componentClass.prototype[methodName] = function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return new Promise(function (resolve, reject) {
              return handler.call(_this, resolve, reject, args);
            });
          };

          return this;
        },
        writable: true,
        configurable: true
      },
      "static": {
        value: function _static(propertyName, value) {
          this.componentClass[propertyName] = value;

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
      },
      "class": {
        value: function _class() {
          return this.componentClass;
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
 * Add another query on the fly and query it with args
 */
DC.Factory.get("fixtures-list").method("recent", function (resolve, reject, args) {
  return resolve("" + args[0] + " recent fixtures");
}).instance().recent(5).then(function (data) {
  return console.log("Result3: " + data);
});

/**
 * Define static property, make sure it's shared between all instances
 */
DC.Factory.get("counter")["static"]("instantiated", 0).init(function () {
  this.constructor.instantiated++;
});

DC.Factory.get("counter").instance();
DC.Factory.get("counter").instance();
DC.Factory.get("counter").instance();

console.log("Instances Count: " + DC.Factory.get("counter")["class"]().instantiated);
