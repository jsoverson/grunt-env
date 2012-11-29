/*
 * grunt-env
 * https://github.com/onehealth/grunt-env
 *
 * Copyright (c) 2012 OneHealth Solutions, inc
 * Licensed under the Apache 2.0 license.
 */

"use strict";

function task(grunt) {
  grunt.registerMultiTask('env', 'Specify an ENV configuration for future tasks in the chain', function() {

    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this, this.data);

    grunt.verbose.writeflags(options, "Options");

    task.run(options);
  });

  task.run = function(config) {
    grunt.util._.extend(process.env, config);
  };
}

module.exports = task;