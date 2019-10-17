const gulp  = require('gulp');
const fs = require('fs');
const path = require('path');
var   fractalBuildMode;

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const buildDestionation = path.resolve('.', 'build').replace(/\\/g, '/');

// Watch folders for changess
gulp.task('watch', function() {
  // gulp.watch(['./src/components/**/*.scss', '!./src/components/**/package.variables.scss'], gulp.parallel('vf-css'));
  // gulp.watch(['./src/components/**/*.js'], gulp.parallel('vf-scripts'));
});

gulp.task('set-to-development', function(done) {
  process.argv.push('--serve');
  process.env.ELEVENTY_ENV = 'development';
  done();
});

gulp.task('set-to-static-build', function(done) {
  process.argv.push('--quiet');
  process.env.ELEVENTY_ENV = 'production';
  done();
});

// // Watch for changes, we'll use this to trigger a fractal rebuild
// const touch = require("touch");
// fractal.components.on('updated', function(source, eventData){
//   console.log('Component source has been updated: ' + source.path);

//   // For now we're just touching a watched file until we can figure out something better
//   // https://github.com/11ty/eleventy/issues/604
//   // A solution will likely require a PR or forking eleventy's cmd.js
//   // to `module.exports = elev;` and then we can:
//   // ```
//   // global.eleventy.restart()
//   // global.eleventy.write()
//   // ```
//   touch('src/site/_data/fractalEnvironment.js');
//   console.log('Manual rebuild of 11ty triggered')
// });


// Run eleventy, but only after we wait for fractal to bootstrap
// @todo: consider if this could/should be two parallel gulp tasks
gulp.task('eleventy', function(done) {
  let elev;
  process.argv.push('--config=eleventy.js'); // Eleventy config

  elev = require('./cmd.js');

  if (process.env.ELEVENTY_ENV == 'production') {
    elev.write().then(function() {
      console.log('Done building 11ty');
      done();
    });
  }
  if (process.env.ELEVENTY_ENV == 'development') {
    elev.watch().then(function() {
      elev.serve('3000');
      // console.log('Done building 11ty');
      done();
    });
  }

});

// Eleventy doesn't always finish promptly, this ensures we exit gulp "cleanly"
gulp.task('manual-exit', function(done) {
  done()(process.exit());
});

// Let's build this sucker.
gulp.task('build', gulp.series(
  'set-to-static-build',
  'eleventy',
  'manual-exit'
));

// Build and watch things during dev
gulp.task('dev', gulp.series(
  'set-to-development',
  'eleventy',
  gulp.parallel('watch')
));
