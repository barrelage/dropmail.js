var fs = require('fs')
  , browserify = require('browserify')
  , UglifyJS = require("uglify-js");

var buildFileDebug = './build/dropmail.js'
  , buildFile      = './build/dropmail.min.js'

browserify()
  .add('./browser')
  .ignore('buffer')
  .require('es5-shim')
  .require('js-base64')
  .require('json2ify')
  .bundle({ debug: true }, function(err, src) {
  if (err) return console.error(err);

  fs.writeFileSync(buildFileDebug, src);
  fs.writeFileSync(buildFile, UglifyJS.minify(src, { fromString: true }).code);
});
