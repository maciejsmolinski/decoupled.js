!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.DC=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  Component  : require('./decoupled/component'),
  Repository : require('./decoupled/repository')
};

},{"./decoupled/component":2,"./decoupled/repository":3}],2:[function(require,module,exports){
module.exports = (function () {
  'use strict';

  /**
   * Keeps renderer object reference, can be injected on the fly
   */
  Component._renderer   = { render: function () {} };

  /**
   * Keeps repository class reference, can be injected on the fly
   */
  Component._repository = { get: function () { return { find: function () {} }; } };

  /**
   * Decorator function for injecting renderer and repository
   *
   * @param  {Object}  options  The only options allowed at the moment: 'renderer', 'repository'
   * @return {void}             Renderer/Repository injected
   */
  Component.setup = function (options) {

    // Allow to inject renderer object
    if (options.renderer && options.renderer.render) {
      Component._renderer = options.renderer;
    }

    // Allow to inject repository class
    if (options.repository && options.repository.get) {
      Component._repository = options.repository;
    }

  };


  /**
   * Component Class
   *
   * Keeps Name and Type so it's easy to find corresponding Repository and Template
   *
   * new Component('profiles/outdated');  // <Component: { name: 'profiles', type: 'outdated' }>
   * new Component('stats/recent');       // <Component: { name: 'stats',    type: 'recent'  }>
   *
   * @param  {String}  path  Shortcut for defining component name and type
   */
  function Component (path) {
    var parts = path.split('/');

    this.name = parts.shift();
    this.type = parts.pop();
  }

  /**
   * Retrieve template path (name/type). Automatically computed from name and type.
   *
   * @return  {String}  Template path, e.g. 'profiles/recent'
   */
  Object.defineProperty(Component.prototype, 'templatePath', {
    get: function () {
        return this.name + '/' + this.type;
    }
  });

  /**
   * Renders component and passes results to callback function.
   *
   * All component cares about is to retrieve data, retrieve template,
   * join these together (compile) and pass results to the callback function
   *
   * Sample Usage:
   *
   *   Component.render('profiles/recent', function (compiled) {
   *     // compiled template available in `compiled` variable
   *   });
   *
   *   // Behind the scenes it:
   *   //   1. Retrieves data using `Repository.get('profiles').find('recent', ...);`
   *   //   2. Retrieves template using `new Renderer('profiles/recent')`
   *   //   3. Once data and template is ready, compiles the template with data
   *   //      and calls `done` with compiled template
   *
   *
   * @param  {String}    path  Component name and type as well as template path, e.g. 'profiles/recent'
   * @param  {Function}  done  Callback function to be called when template is compiled with data
   * @return {void}
   */
  Component.render = function (path, done) {
    var component  = new Component(path);
    var repository = Component._repository.get(component.name);

    repository.find(component.type, function (data) {
      done( Component._renderer.render(component.templatePath, data) );
    });
  };

  return Component;

}());

},{}],3:[function(require,module,exports){
module.exports = (function () {
  'use strict';

  /**
   * Titleize input text
   *
   * Sample Usage:
   *   _titleize('profiles'); // => 'Profiles'
   *   _titleize('stats');    // => 'Stats'
   *   _titleize('my-stats'); // => 'Mystats'
   *
   * @param  {String}  input  Input text to be titleized
   * @return {String}         Titleized text
   */
  function _titleize (input) {
    input = input.replace(/\W/, ''); // Get rid of non-alphanumeric characters
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(); // e.g.'user' -> 'User'
  }


  /**
   * Repository constructor
   */
  function Repository () {}


  /**
   * Repository factory method
   *
   * Returns new object from given class if the class is available in <Repository> namespace, e.g. Repository.Profiles
   *
   * Sample Usage:
   *   Repository.get('profiles');      // <Repository.Profiles Object { ... }>
   *   Repository.get('stats');         // <Repository.Stats Object { ... }>
   *   Repository.get('non-existing');  // <Error 'Repository "Non-existing" not found'>
   *
   * @param  {String}  repositoryClass  Class to retrieve new object from
   * @return {Object}                   Repository Object made from given class
   */
  Repository.get = function (repositoryClass) {
    var className = _titleize(repositoryClass);

    if (! Repository[className]) {
      throw new Error('Repository "' + className + '" not found');
    }

    return new Repository[className]();
  };


  /**
   * CoreClass constructor
   */
  Repository.CoreClass = function CoreClass () {};


  /**
   * CoreClass find method, picks correct find method by type or finds all data directly from the source
   *
   * Sample Usage:
   *
   *   repositoryClass.find('recent',   function (data) { ... }); // calls repositoryClass.findRecent and passes callback
   *   repositoryClass.find('outdated', function (data) { ... }); // calls repositoryClass.findOutdated and passes callback
   *
   * @return  {void}  Calls the callback when data is received
   */
  Repository.CoreClass.prototype.find = function (/* [type], callback */) {
    var args   = [].slice.call(arguments);
    var done   = args.pop();   // Last argument is always a callback to call when data is loaded
    var type   = args.shift(); // Type, when defined, should be the first argument
    var method = type ? 'find' + _titleize(type) : 'find'; // e.g. findRecent if type=recent, otherwise just "find"

    if (this[method]) {
      this[method].call(this, done);
    } else {
      throw new Error('Repository.CoreClass.prototype.find without type not allowed');
    }

  };


  /**
   * Create Repository Class that automatically inherits from Repository.CoreClass
   *
   * @param  {String}   repositoryClass  Repository class name, e.g. 'profiles' (will be automatically titleized)
   * @param  {Function} classBody        Class constructor
   * @return {Function}                  Class constructor that automatically inherits from Repository.CoreClass
   */
  Repository.create = function (repositoryClass, classBody) {
    var className = _titleize(repositoryClass);

    Repository[className] = function () {
      Repository.CoreClass.call(this);
      classBody.call(this);
    };

    Repository[className].prototype   = Object.create(Repository.CoreClass.prototype);
    Repository[className].constructor = classBody;

    return Repository[className];
  };

  /**
   * Adds finder method so that it's easy to define finder types
   *
   * Sample Usage:
   *
   *   // Creates Repository.Profiles.prototype.findRecent method
   *   repo.addFinder('profiles/recent', function (done) {
   *     done(data);
   *   });
   *
   * @param  {String}   path       Slash separated class name and finder method, e.g 'profiles/recent'
   * @param  {Function} classBody  Method that retrieves data from given endpoint
   * @return {Function}            Repository Constructor
   */
  Repository.addFinder = function (path, finderMethod) {
    var classAndFinder = path.split('/');

    var className      = _titleize(classAndFinder.shift());
    var methodName     = 'find' + _titleize(classAndFinder.pop());

    Repository[className].prototype[methodName] = finderMethod;

    return Repository;
  };

  return Repository;

}());

},{}]},{},[1])(1)
});