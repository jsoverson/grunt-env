module.exports = function(grunt) {
  'use strict';

  process.env.TEST = 'test';

  // Project configuration.
  grunt.initConfig({
    env: {
      options: {
        globalOption: 'foo'
      },
      testData: {
        UNDEFINED_OPTION: function() {
          // logic here might return undefined or not, but for testing we do
          return undefined;
        },
        TEST: 'test',
        data: 'bar'
      },
      testOptions: {
        options: {
          localOption: 'baz',
          USER: 'fritz'
        }
      },
      testDotEnv: {
        src: ['.env', '.env.json', '.env.ini', '.env.yaml']
      },
      testEnvdir: {
        src: ['.envdir/*'],
        options: {
          envdir: true
        }
      },
      testDirectives: {
        ADD_NEGATIVE: 'should not change',
        PATHLIKE: 'foo:bar:baz',
        UNSHIFTBASIC: 'bar',
        UNSHIFTOBJECT: 'bar',
        REPLACE: 'foo',

        options: {
          add: {
            ADD_POSITIVE: 'should be this',
            ADD_NEGATIVE: 'should not change to this'
          },
          replace: {
            REPLACE: 'bar',
            REPLACE_NEGATIVE: '',
          },
          push: {
            PATHLIKE: {
              value: 'qux',
              delimiter: ':'
            }
          },
          unshift: {
            UNSHIFTBASIC: 'foo',
            UNSHIFTOBJECT: {
              value: 'foo'
            }

          }
        }
      },
      testFunctions: {
        DATA_FROM_FUNCTION: function() {
          return process.env.DATA_FROM_FUNCTION || '123';
        },
        A_STRING: 'string'
      }
    },
    clean: {
      env: ['.env*']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      task: ['tasks/**/*.js'],
      Gruntfile: ['Gruntfile.js']
    },
    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: ['tasks/**/*.js', 'lib/**/*.js', 'Gruntfile.js']
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jscs');

  var assert = require('assert');

  grunt.registerTask('testData', function() {
    assert.equal(process.env.globalOption, 'foo', 'globalOption should be set');
    assert.equal(process.env.data, 'bar', 'data should be set');
    delete process.env.globalOption;
    delete process.env.data;

    assert.equal(
      process.env.hasOwnProperty('UNDEFINED_OPTION'),
      false,
      'UNDEFINED_OPTION should not be set on process.env'
    );
  });

  grunt.registerTask('testOptions', function() {
    assert.equal(process.env.globalOption, 'foo', 'globalOption should be set');
    assert.equal(process.env.localOption, 'baz', 'localOption should be set');
    delete process.env.globalOption;
    delete process.env.localOption;
  });

  grunt.registerTask('testFunctions', function() {
    assert.equal(process.env.DATA_FROM_FUNCTION, '123', 'should set from function');
    assert.equal(process.env.A_STRING, 'string', 'should set from string');
    delete process.env.DATA_FROM_FUNCTION;
    delete process.env.A_STRING;
  });

  grunt.registerTask('testDirectives', function() {
    assert.equal(process.env.ADD_NEGATIVE, 'should not change', 'add should not change existing env var');
    assert.equal(process.env.ADD_POSITIVE, 'should be this', 'add should create new var if it does not exist');
    assert.equal(process.env.PATHLIKE, 'foo:bar:baz:qux', 'extend should take delimiters into account');
    assert.equal(process.env.UNSHIFTBASIC, 'foobar', 'should extend without specifying object');
    assert.equal(process.env.UNSHIFTOBJECT, 'foobar', 'should extend while specifying object');
    assert.equal(process.env.REPLACE, 'bar', 'replace should replace existing var');
    delete process.env.ADD_NEGATIVE;
    delete process.env.ADD_POSITIVE;
    delete process.env.PATHLIKE;
    delete process.env.UNSHIFTBASIC;
    delete process.env.UNSHIFTOBJECT;
    delete process.env.REPLACE;
    delete process.env.globalOption;
  });

  grunt.registerTask('writeDotEnv', function() {
    grunt.file.write('.env', 'dotEnvFileData=bar\ndotEnvFileOption=baz');
    var json = {
      jsonValue: 'foo',
      push: {
        PATHLIKE: 'jsonPath'
      }
    };
    grunt.file.write('.env.json', JSON.stringify(json, null, 2));
    grunt.file.write('.env.ini', 'dotEnvIniFileData=bar.ini\ndotEnvIniFileOption=baz.ini\n');
    grunt.file.write('.env.yaml', 'yamlValue: foo');
  });

  grunt.registerTask('testDotEnv', function() {
    assert(!process.env.src, 'Should not include src');
    assert.equal(process.env.jsonValue, 'foo', 'value from json env file should be set');
    assert.equal(process.env.PATHLIKE, 'jsonPath', 'should process directives in json');
    assert.equal(process.env.globalOption, 'foo', 'should still get global options');
    assert.equal(process.env.dotEnvFileData, 'bar', 'dotEnvFileData should be set');
    assert.equal(process.env.dotEnvFileOption, 'baz', 'dotEnvFileOption should be set');
    assert.equal(process.env.dotEnvIniFileData, 'bar.ini', 'dotEnvIniFileData should be set');
    assert.equal(process.env.dotEnvIniFileOption, 'baz.ini', 'ndotEnvIniFileOption should be set');
    assert.equal(process.env.yamlValue, 'foo', 'yamlValue should be set');
    delete process.env.jsonValue;
    delete process.env.dotEnvFileData;
    delete process.env.dotEnvFileOption;
    delete process.env.PATHLIKE;
    delete process.env.globalOption;
    delete process.env.dotEnvIniFileData;
    delete process.env.dotEnvIniFileOption;
    delete process.env.yamlValue;
  });

  grunt.registerTask('writeEnvdir', function() {
    grunt.file.mkdir('.envdir/bar');
    grunt.file.write('.envdir/ENVDIR', 'envdir');
    grunt.file.write('.envdir/BAZ', 'baz');
    grunt.file.write('.envdir/bar/FOO', 'foo');
  });

  grunt.registerTask('testEnvdir', function() {
    assert(!process.env.envdir, 'Should not include src');
    assert.equal(process.env.ENVDIR, 'envdir', 'value from envdir file should be set');
    assert.equal(process.env.BAZ, 'baz', 'value from envdir file should be set');
    assert(!process.env.FOO, 'Should not include subdirectories');
    delete process.env.ENVDIR;
    delete process.env.BAR;
  });

  // Default task.
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'jscs',
    'env:testData',
    'testData',
    'env:testOptions',
    'testOptions',
    'writeDotEnv',
    'env:testDotEnv',
    'testDotEnv',
    'env:testDirectives',
    'testDirectives',
    'env:testFunctions',
    'testFunctions',
    'writeEnvdir',
    'env:testEnvdir',
    'testEnvdir',
    'clean'
  ]);
};
