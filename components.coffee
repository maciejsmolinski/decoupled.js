###

  Simple Registry for storing classes/instances application-wide

  ComponentRegistry.get('articles')                                   // => undefined
  ComponentRegistry.add('articles', ComponentFactory.get('articles'))
  ComponentRegistry.get('articles')                                   // => <CustomComponent>

###
class ComponentRegistry
  @registry = {}
  @add      = (name, component) ->
    ComponentRegistry.registry[name] = component
  @get      = (name) ->
    ComponentRegistry.registry[name]




###

  Simple Factory/Facade for creating component classes and getting their instances

  ComponentFactory
    .get('articles')                                                         // (1)
    .init(function () { return this.endpoint = 'http://articles.com' })      // (2)
    .method('last', function () { return this.endpoint + '/last.json' })     // (3)
    .instance()                                                              // (4)
    .last()                                                                  // (5)  => 'http://articles.com/last.json'

  // (1) Creates class if not yet defined, gets class if already defined
  // (2) Sets initialisation method for Component Class
  // (3) Sets class method
  // (4) Returns new instance of the class
  // (5) Calls previously defined method on the instance and returns the results

  ComponentFactory
    .get('articles')                                                         // (6)
    .method('recent', function () { return this.endpoint + '/recent.json' }) // (7)
    .instance()                                                              // (8)
    .recent()                                                                // (9)  => 'http://articles.com/recent.json'

  // (6) Gets previously defined class
  // (7) Adds another method to the previously created class ('last' and 'recent' are now available)
  // (8) Returns new instance of the class
  // (9) Calls previously defined method on the instance and returns the results

###
class ComponentFactory
  @classes = {}

  @baseClass = class CoreComponent
    constructor: (@name) ->
      this.init?.apply(@, arguments)

  @get = (name, constructor) ->
    new ComponentFactory name

  constructor: (@name) ->
    @componentClass = ComponentFactory.classes[@name] ? ComponentFactory.classes[@name] = class CustomComponent extends CoreComponent

  init: (init) ->
    @componentClass::init = init
    @

  method: (methodName, handler) ->
    @componentClass.prototype[methodName] = handler
    @

  instance: () ->
    new @componentClass @name


console.log result for result in [
  ComponentFactory
    .get('articles')
    .init(() -> this.endpoint = 'http://articles.com' )
    .method('last', -> this.endpoint + '/last.json')
    .instance()
    .last()
]

###

ComponentRegistry
  .get('articles')
  .recent()
  .then(Component.render);
  .then(function (compiled) {
    # Do whatever you want
  });

ComponentFactory
  .create('articles', function (constructor) {
    this.endpoint = 'http://articles.com/recent.json'
  })
  .method('recent', function () {
    return new Promise(function (resolve, reject) {
      $.getJSON(this.endpoint)
        .then(resolve, reject)
    })
  })

###
