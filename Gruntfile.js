module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    env : {
      options: {
        globalOption : 'foo'
      },
      testData : {
        data : 'bar'
      },
      testOptions : {
        options : {
          localOption : 'baz'
        }
      }
    },
    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      task : ['tasks/**/*.js']
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  var assert = require('assert');

  grunt.registerTask('testData', function(grunt){
    assert.equal(process.env.globalOption, 'foo', 'globalOption should be set');
    assert.equal(process.env.data, 'bar', 'data should be set');
    delete process.env.globalOption;
    delete process.env.data;
  });

  grunt.registerTask('testOptions', function(grunt){
    assert.equal(process.env.globalOption, 'foo', 'globalOption should be set');
    assert.equal(process.env.localOption, 'baz', 'localOption should be set');
    delete process.env.globalOption;
    delete process.env.localOption;
  });

  // Default task.
  grunt.registerTask('default', ['jshint','env:testData', 'testData', 'env:testOptions', 'testOptions']);

};
