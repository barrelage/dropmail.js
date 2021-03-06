var fs = require('fs')
  , browserify = require('browserify')
  , UglifyJS = require("uglify-js");

var bundler = browserify()
  .add('./browser')
  .ignore('buffer')
  .require('cookies-js')
  .require('es5-shim')
  .require('json2ify')
  .require('store');

var buildFileDebug = './build/dropmail.debug.js'
  , buildFileMin   = './build/dropmail.min.js'
  , buildFile      = './build/dropmail.js';

bundler.bundle({ debug: true }, function(err, src) {
  if (err) return console.error(err);
  fs.writeFile(buildFileDebug, src);
});

bundler.bundle(function(err, src) {
  if (err) return console.error(err);
  fs.writeFile(buildFile, src);
  fs.writeFile(buildFileMin, UglifyJS.minify(src, { fromString: true }).code);
});
