# grunt-env

Specify an ENV configuration as a task, e.g.

```
  grunt.registerTask('dev', 'env:dev lint test');
  grunt.registerTask('build', 'env:build lint test');

```

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-env`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-env');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Configuration

```js
  env : {
    dev : {
      env_var : 'env value'
    }
  }
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

- 0.1.0 Initial release

## License

Copyright (c) 2012 OneHealth Solutions, Inc
Licensed under the Apache 2.0 license.

## Author

Jarrod Overson
