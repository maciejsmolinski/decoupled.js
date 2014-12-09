# Decoupled.js

Allows to easily separate business logic in your application from the View and Data-Access layers.
Not dependend on any 3rd party library, fully customisable.

## Reasoning

Async apps often retrieve data, modify and and then render in given place. This happens frequently.
As your app grows, you may end up with business logic mixed up with the view layer logic, rendering process and much more. This is an answer to these problems. 

## Building Blocks

* Component
* Built-in Modular Repository System (any can be injected)
* Renderer (any can be injected)

## Setting Up

Define your repository system and rendering engine:

``` javascript
DC.Component.setup({
  repository : DC.Repository,
  renderer   : nunjucks
});
```

## Repositories (Business Logic)

First, define your repository class with custom constructor

``` javascript
DC.Repository.create('profiles', function () {

  // Setup properties that will be used later on by finder methods
  this.endpoint = 'http://site.com/api/profiles';

});
```

Second, define custom finder methods, this is where business logic sits. You can manipulate data however you want

``` javascript
DC.Repository.addFinder('profiles/recent', function (done) {

  // You don't have to use jQuery, this is just an example 
  $.getJSON(this.endpoint + '?recent=true').success(function (data) {
     // Manipulate data
     // Pass back manipulated data to the callback function
     done(data); 
  });

});
```

## Components (Glue)

Components are the glue between retrieved data from repositories and rendering engine.

``` javascript
DC.Component.render('profiles/recent', function (compiled) {

  // You can do whatever you want with the compiled template,
  // e.g. append it using jQuery to a given DOM Node
  $('.profiles').append(compiled);

});
```

## Wrapping Up

``` javascript

// 1. Setup the library to use it's own repository and given rendering engine
DC.Component.setup({
  repository : DC.Repository,
  renderer   : nunjucks
});

// 2. Setup Repository with custom finders (business logic)
DC.Repository.create('profiles', function () {
  this.endpoint = 'http://site.com/api/profiles';
});

DC.Repository.addFinder('profiles/recent', function (done) {
  $.getJSON(this.endpoint + '?recent=true').success(function (data) {
     done(data); 
  });
});

// 3. Render Component and append to the dom tree
DC.Component.render('profiles/recent', function (compiled) {
  $('.profiles').append(compiled);
});
```

## How this works

`Component.render('profiles/recent' function (compiled) { /* ... */ });`
1. Retrieves data using new `<RepositoryClass>.Profiles` object with `.find('recent', cb)` method
2. Once done, calls rendering engine, e.g. `<RendererObject>.render('profiles/recent', data')` with retrieved data
3. Passes back `compiled` template to the callback 

## Contributing
Feel free to contribute or contact me at contact@maciejsmolinski.com with any questions
