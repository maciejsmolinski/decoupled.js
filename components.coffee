######

# Temporary polyfill
class Promise
  constructor: (cb) ->
    @cbks = []
    cb.call @, (data) => cbk(data, data) for cbk in @cbks

  catch: (cb) ->
    @cbks.push(cb)
    @

  then: (cb) ->
    @cbks.push(cb)
    @

# Temporary polyfill
class Component
  @render = (data) ->
    console.log 'Component#render', data
    data

######


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
    .get('articles')                                                                      // (1)
    .init(function () { return this.endpoint = 'http://articles.com' })                   // (2)
    .method('last', function (resolve, reject) { resolve(this.endpoint + '/last.json') }) // (3)
    .instance()                                                                           // (4)
    .last()                                                                               // (5)  => <Promise>
    .then(function (data) {
      // Do whatever you want with the data
    })
    .catch(function (error) {
      // Catch errors
    })

  // (1) Creates class if not yet defined, gets class if already defined
  // (2) Sets initialisation method for Component Class (will return a Promise)
  // (3) Sets class method
  // (4) Returns new instance of the class
  // (5) Calls previously defined method on the instance and returns a Promise

  ComponentFactory
    .get('articles')                                                                        // (6)
    .method('recent', function (resolve, reject) { resolve(this.endpoint + '/rcnt.json') }) // (7)
    .instance()                                                                             // (8)
    .recent()                                                                               // (9)  => <Promise>
    .then(function (data) {
      // Do whatever you want with the data
    })
    .catch(function (error) {
      // Catch errors
    })

  // (6) Gets previously defined class
  // (7) Adds another method to the previously created class (will return a Promise)
  // (8) Returns new instance of the class
  // (9) Calls previously defined method on the instance and returns a Promise

###
class ComponentFactory
  @classes = {}

  @baseClass = class CoreComponent
    constructor: (@name) ->
      @init?.apply(@, arguments)

  @get = (name, constructor) ->
    new ComponentFactory name

  constructor: (@name) ->
    @componentClass = ComponentFactory.classes[@name] ? ComponentFactory.classes[@name] = class CustomComponent extends CoreComponent

  init: (init) ->
    @componentClass::init = init
    @

  method: (methodName, handler) ->
    @componentClass.prototype[methodName] = ->
      new Promise handler.bind(@)
    @

  instance: () ->
    new @componentClass @name



console.log result for result in [
  ComponentFactory
    .get('articles')
    .init(-> @endpoint = 'http://articles.com' )
    .method('last', (resolve, reject) ->
      setTimeout(resolve.bind(@, @endpoint + '/last.json'))
    )
    .instance()
    .last()
    .then(Component.render),

  ComponentFactory
    .get('comments')
    .init(-> @endpoint = 'http://comments.com')
    .method('all', (resolve, reject) =>
      # Anything asynchronous here
      # $.getJSON(@endpoint).then(resolve, reject)

      setTimeout(resolve.bind(@, { comments: [ 1,2,3 ] }), 3000)
    )
    .instance()
    .all()
    .then(Component.render),

  ComponentFactory
    .get('comments')
    .init(-> @endpoint = 'http://comments.com')
    .method('all', (resolve, reject) =>
      # Anything asynchronous here
      # $.getJSON(@endpoint).then(resolve, reject)
      console.log arguments
      setTimeout(reject.bind(null, Error('Found an error while fetching articles')), 1000)
    )
    .instance()
    .all()
    .then(Component.render)
    .catch(Component.render)
]
