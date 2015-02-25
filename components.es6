'use strict';

class ComponentRegistry {
  static registry = {}

  static add (name, component) {
    return this.registry[name] = component;
  }

  static get (name) {
    return this.registry[name];
  }
}


class ComponentFactory {
  static classes = {};

  static BaseClass = class BaseClass {
    constructor () {
      this.init && this.init.apply(this, Array.from(arguments))
    }
  }

  static get () {
    return new this(Array.from(arguments))
  }

  constructor (name) {
    ComponentFactory.classes[name] ?= class CustomComponent extends ComponentFactory.BaseClass {};
    this.componentClass = ComponentFactory.classes[name];
  }

  init (handler) {
    this.componentClass.prototype.init = handler;

    return this;
  }

  method (methodName, handler) {
    this.componentClass.prototype[methodName] = () =>
      new Promise(handler.bind(this))

    return this;
  }

  instance () {
    return new this.componentClass;
  }
}

/**
 * Define Component
 */
ComponentFactory
  .get('fixtures-list')
  .init(function () { this.name = 'fixtures-list' })
  .method('last', (resolve, reject) => resolve('last') )

/**
 * Retrieve Component, get instance, run the query
 */
ComponentFactory
  .get('fixtures-list')
  .instance()
  .last()
  .then( (data) => console.log(`Result1: ${data}`) );

/**
 * Do the same again
 */
ComponentFactory
  .get('fixtures-list')
  .instance()
  .last()
  .then( (data) => console.log(`Result2: ${data}`) );

/**
 * Add another query on the fly and query it
 */
ComponentFactory
  .get('fixtures-list')
  .method('recent', (resolve, reject) => resolve('recent'))
  .instance()
  .recent()
  .then( (data) => console.log(`Result3: ${data}`) )
