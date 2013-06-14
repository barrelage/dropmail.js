var fs = require('fs')
  , browserify = require('browserify')
  , UglifyJS = require("uglify-js");

var bundler = browserify()
  .add('./browser')
  .ignore('buffer')
  .require('es5-shim')
  .require('js-base64')
  .require('json2ify');

var buildFileDebug = './build/dropmail.debug.js'
  , buildFileMin   = './build/dropmail.min.js'
  , buildFile      = './build/dropmail.js';

bundler.bundle({ debug: true }, function(err, src) {
  if (err) return console.error(err);
  fs.writeFile(buildFileDebug, src);
});

bundler.bundle(function(err, src) {
  fs.writeFile(buildFile, src);
  fs.writeFile(buildFileMin, UglifyJS.minify(src, { fromString: true }).code);
});
