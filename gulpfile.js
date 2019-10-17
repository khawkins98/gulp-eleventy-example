const gulp  = require('gulp');
var through = require('through2');

// Generate a sample list of all files in ./src
// for demonstration Gulp integration with Eleventy
gulp.task('file-list', function () {
  global.fileList = [];
  return gulp.src(['./src/**/*.{njk,html,js,md}'])
    .pipe(through.obj(function (file, enc, cb) {
      global.fileList.push(file.path);
      cb(null);
    }));
});

// Watch folders for changess
gulp.task('watch', function() {
  gulp.watch(['./src/**/*.{njk,html,js,md'], gulp.series('file-list', 'eleventy:reload'));
});

// Run eleventy
process.argv.push('--config=eleventy.js'); // Eleventy config
let elev = require('./eleventy-cmd.js');

gulp.task('eleventy:develop', function(done) {
  process.argv.push('--serve');
  process.env.ELEVENTY_ENV = 'development';

  // You could instead use elev.write() here, but then you should add your own browsersync task
  elev.watch().then(function() {
    elev.serve('3000');
    done();
  });
});

gulp.task('eleventy:build', function(done) {
  process.argv.push('--quiet');
  process.env.ELEVENTY_ENV = 'production';

  elev.write().then(function() {
    console.log('Done building 11ty');
    done();
  });
});

gulp.task('eleventy:reload', function(done) {
  elev.restart()
  elev.write()
});

// Eleventy doesn't always finish promptly
// You can probably leave this command out 99% of the time
gulp.task('eleventy:hard-exit', function(done) {
  done()(process.exit());
});

// Let's build this sucker.
gulp.task('build', gulp.series(
  'file-list',
  'eleventy:build',
  'eleventy:hard-exit'
));

// Build and watch things during dev
gulp.task('dev', gulp.series(
  'file-list',
  'eleventy:develop',
  gulp.parallel('watch')
));
