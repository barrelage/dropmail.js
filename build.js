var fs = require('fs')
  , browserify = require('browserify')
  , UglifyJS = require("uglify-js");

var buildFileDebug = './browser/build/dropmail.js'
  , buildFile      = './browser/build/dropmail.min.js'

browserify()
  .add('./browser')
  .require('es5-shimify')
  .require('json2ify')
  .bundle(function(err, src) {
  if (err) return console.error(err);

  fs.writeFileSync(buildFileDebug, src);
  fs.writeFileSync(buildFile, UglifyJS.minify(src, { fromString: true }).code);
});
