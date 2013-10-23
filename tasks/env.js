/*
 * grunt-env
 * https://github.com/onehealth/grunt-env
 *
 * Copyright (c) 2012 OneHealth Solutions, inc
 * Licensed under the Apache 2.0 license.
 */

"use strict";

var ini = require('ini');
var extensionPattern = /\.([^\.]+)$/i;

module.exports = function (grunt) {
  var readJson = function (file) {
    try {
      return grunt.file.readJSON(file);
    } catch(e) {
      return;
    }
  };

  var readYaml = function (file) {
    try {
      return grunt.file.readYAML(file);
    } catch(e) {
      return;
    }
  };

  var readIni = function (file) {
    try {
      return ini.parse(grunt.file.read(file));
    } catch(e) {
      return;
    }
  };

  grunt.registerMultiTask('env', 'Specify an ENV configuration for future tasks in the chain', function() {

    var data = grunt.util._.clone(this.data);
    delete data.src;
    processDirectives(data);

    var options = this.options();

    if (this.files.length) {
      if(options.envdir) {
        var d = _.zipObject(this.files[0].src.map(function(file){
          if(grunt.file.isFile(file)) {
            return [path.basename(file), grunt.file.read(file)];
          }
        }));
        processDirectives(d);
      } else {
        this.files[0].src.forEach(function(file){
          var match = file.match(extensionPattern);
          if (!match) {
            grunt.log.error('file not supported.');
            return;
          }
          var parse = (function() {
            switch(match[1]) {
              case 'json': return readJson;
              case 'yaml': return readYaml;
              //jshint complains about no break statement
              case 'ini': return readIni;
              default: return readIni;
            }
          })();

          var data = parse(file) || {};
          grunt.util._.extend(process.env, data);
        });
      }
    }

    delete options.envdir;
    processDirectives(options);
  });

  function processDirectives(options) {

    var dispatch = {
      add : add,
      replace : replace,
      unshift : arrayLike.bind({}, 'unshift'),
      push : arrayLike.bind({}, 'push'),
      concat : arrayLike.bind({}, 'push')
    };

    _.forEach(options, function(optionData, option) {
      if (option === 'options') return;
      var fn = dispatch[option];
      if (fn && typeof optionData === 'object') {
        _.forEach(optionData, fn);
      } else {
        var data = {};
        data[option] = typeof optionData === 'function' ? optionData() : optionData;
        _.extend(process.env, data);
      }
    });
  }

  function add(value, key) {
    if (process.env[key]) return grunt.log.writeln(key + ' already exists, leaving unchanged.');

    var data = {};
    data[key] = value;
    _.extend(process.env, data);
  }

  function replace(value, key) {
    if (!process.env[key]) return grunt.log.writeln(key + ' doesn\'t exist, refusing to replace.');
    process.env[key] = value;
  }

  function arrayLike(method, value, key) {
    process.env[key] = process.env[key] || '';
    var delimiter = value ? value.delimiter || '' : '';

    if (typeof value === 'object') value = value.value;

    if (method === 'unshift') {
      process.env[key] = value + delimiter + process.env[key];
    } else if (method === 'push') {
      process.env[key] += delimiter + value;
    }
  }
};
