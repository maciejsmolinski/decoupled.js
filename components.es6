;(function (exports) {

  class Registry {
    static registry = {}

    static add (name, component) {
      return this.registry[name] = component;
    }

    static get (name) {
      return this.registry[name];
    }
  }


  class Factory {
    static classes = {};

    static BaseClass = class BaseClass {
      constructor (...args) {
        this.init && this.init.call(this, args);
      }
    }

    static get (...args) {
      return new this(args);
    }

    constructor (name) {
      Factory.classes[name] ?= class CustomComponent extends Factory.BaseClass {};
      this.componentClass = Factory.classes[name];
    }

    init (handler) {
      this.componentClass.prototype.init = handler;

      return this;
    }

    method (methodName, handler) {
      this.componentClass.prototype[methodName] = function (...args) {
        return new Promise((resolve, reject) => handler.call(this, resolve, reject, args));
      }

      return this;
    }

    static (propertyName, value) {
      this.componentClass[propertyName] = value;

      return this;
    }

    instance () {
      return new this.componentClass;
    }

    class () {
      return this.componentClass;
    }
  }

  exports.DC ?= {
    Factory  : Factory,
    Registry : Registry
  }

}(new Function ('return this || global;')()));

/**
 * Define Component
 */
DC.Factory
  .get('fixtures-list')
  .init(function () { this.name = 'fixtures-list' })
  .method('last', (resolve, reject) => resolve('last') )

/**
 * Retrieve Component, get instance, run the query
 */
DC.Factory
  .get('fixtures-list')
  .instance()
  .last()
  .then( (data) => console.log(`Result1: ${data}`) );

/**
 * Do the same again
 */
DC.Factory
  .get('fixtures-list')
  .instance()
  .last()
  .then( (data) => console.log(`Result2: ${data}`) );

/**
 * Add another query on the fly and query it with args
 */
DC.Factory
  .get('fixtures-list')
  .method('recent', (resolve, reject, args) => resolve(`${args[0]} recent fixtures`))
  .instance()
  .recent(5)
  .then( (data) => console.log(`Result3: ${data}`) )


/**
 * Define static property, make sure it's shared between all instances
 */
DC.Factory
  .get('counter')
  .static('instantiated', 0)
  .init(function () { this.constructor.instantiated++ })

DC.Factory.get('counter').instance();
DC.Factory.get('counter').instance();
DC.Factory.get('counter').instance();

console.log(
  `Instances Count: ${DC.Factory.get('counter').class().instantiated}`
)
