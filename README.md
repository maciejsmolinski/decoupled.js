# Decoupled.js

Allows to easily separate business logic in your application from the View and Data-Access layers.
Not dependent on any 3rd party library, fully customisable.

## Development

Install basic dependencies

``` bash
sudo npm install -g babel nodemon
```

Execute with Node / Compile automatically

``` bash
babel --playground --watch components.es6 --out-file components.js # Compile+Watch
babel-node --playground components.es6 # Execute code once
nodemon components.es6 # Execute+Watch
```

## Reasoning

Async apps often retrieve data, modify and and then render in given place. This happens frequently.
As your app grows, you may end up with business logic mixed up with the view layer logic, rendering process and much more. This is an answer to these problems. 

## Building Blocks

* Component Classes (sort of repositories)

## Setting Up

``` javascript
/* tbd */
```

## Repositories (Business Logic)

First, define or retrieve if already defined your repository class with custom constructor

``` javascript
  DC.ComponentFactory
  .get('profiles')
  .init(function () {

    // Setup properties that will be used later on by finder methods
    this.endpoint = 'http://site.com/api/profiles';

  })
});
```

Second, define custom finder methods, this is where business logic sits. You can manipulate data however you want.
All methods return Promise.

``` javascript
  DC.ComponentFactory
  .get('profiles')
  .method('recent', function (resolve, reject) {

    // You don't have to use jQuery, this is just an example 
    $.getJSON(this.endpoint + '?type=recent')
    .then(

      function (data) {
        // Manipulate and return data
        resolve(data); 
      },

      function () {
        // Return useful error message
        reject(Error('Something Failed'));
      }

    );

  })
});
```



## Wrapping Up

``` javascript
/* tbd */
```

## Contributing
Feel free to contribute or contact me at contact@maciejsmolinski.com with any questions
