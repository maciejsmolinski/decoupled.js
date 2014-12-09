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
