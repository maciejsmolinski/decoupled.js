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
  Repository.CoreClass.prototype.find = function (/* type, callback[, argsArray] */) {
    var args   = [].slice.call(arguments);
    var type   = args[0]; // Type, when defined, should be the first argument
    var method = type ? 'find' + _titleize(type) : 'find'; // e.g. findRecent if type=recent, otherwise just "find"

    if (this[method]) {
      this[method].apply(this, args.slice(1));
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
