/*
 * grunt-env
 * https://github.com/onehealth/grunt-env
 *
 * Copyright (c) 2012 OneHealth Solutions, inc
 * Licensed under the Apache 2.0 license.
 */

"use strict";
var ini = require('ini');

module.exports = function (grunt) {

    // Helpers dependant on grunt
    function addToEnv(data) {
        grunt.util._.extend(process.env, data);
    }

    function parseFile(file) {
        var result = {};
        if(file) {
            var fileContent = grunt.file.read(file);
            result = readJson(fileContent) || readIni(fileContent) || result;
        }
        return result;
    }

    function addFile(file) {
      addToEnv(parseFile(file));
    }

    function addFiles(files) {
      files.forEach(function (file) {
        addToEnv(parseFile(file));
      });
    }

  grunt.registerMultiTask('env', 'Specify an ENV configuration for future tasks in the chain', function() {

    var data = grunt.util._.clone(this.data);
    var options = this.options();
    var commonSrc = options.src;

    delete data.src;
    delete options.src;

    addToEnv(options);

    if(Array.isArray(commonSrc)) {
      addFiles(commonSrc);
    } else {
      addFile(commonSrc);
    }

    addToEnv(data);

    if (this.files.length) {
      addFiles(this.files[0].src);
    }
  });
};

function readJson(content) {
  try {
    return JSON.parse(content);
  } catch(e) {
    return;
  }
}

function readIni(content) {
  try {
    return ini.parse(content);
  } catch(e) {
    return;
  }
}


