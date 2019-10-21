const gulp  = require('gulp');
const through = require('through2');
// Prepare eleventy
process.argv.push('--config=eleventy.js'); // Eleventy config
const elev = require('./eleventy-cmd.js');

// Watch folders for changess
gulp.task('watch', function() {
  gulp.watch(['./src/**/*.{njk,html,js,md'}], gulp.series('file-list', 'eleventy:reload'));
});

// Generate a sample list of all files in ./src
// for demonstration Gulp integration with Eleventy
// This list can be re-made by gulp and passed to Eleventy by way of 
// src/site/_data/fileList.js
gulp.task('file-list', function () {
  global.fileList = []; // there might be a better way make a variable to 11ty 
  return gulp.src(['./src/**/*.{njk,html,js,md}'])
    .pipe(through.obj(function (file, enc, cb) {
      global.fileList.push(file.path);
      cb(null);
    }));
});

// Run elevent for local development
gulp.task('eleventy:develop', function(done) {
  process.argv.push('--serve');
  process.env.ELEVENTY_ENV = 'development';

  // You could instead use elev.write() here, but then you should add your own browsersync task
  elev.watch().then(function() {
    console.log('Eleventy loaded, serving to browser');
    elev.serve('3000');
    done();
  });
});

// Run eleventy as a static build
gulp.task('eleventy:build', function(done) {
  process.argv.push('--quiet');
  process.env.ELEVENTY_ENV = 'production';

  elev.write().then(function() {
    console.log('Done building 11ty');
    done();
  });
});

// Refresh eleventy
// This is more thorough than elev.watch() as it will
// also capture variable changes
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
  'watch'
));
