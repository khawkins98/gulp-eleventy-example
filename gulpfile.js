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

// Run eleventy, but only after we wait for fractal to bootstrap
// @todo: consider if this could/should be two parallel gulp tasks
gulp.task('eleventy', function(done) {
  let elev;
  process.argv.push('--config=eleventy.js'); // Eleventy config

  elev = require('./node_modules/\@visual-framework/vf-eleventy--extensions/11ty/cmd.js');

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
