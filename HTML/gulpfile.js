var gulp = require('gulp'),
    fs = require('fs'),
    manifest = require('gulp-manifest'),
    swPrecache = require('sw-precache');

gulp.task('default', ['generate-service-worker', 'manifest']);

gulp.task('generate-service-worker', function(callback) {
  swPrecache({
    staticFileGlobs: ['*.{html,json}', 'assets/**/*',
        'service-worker-registration.js', 'service-worker.js']
  }, function(error, swFileContents) {
    if (error) {
      return callback(error);
    }
    fs.writeFile('service-worker.js', swFileContents, callback);
  });
});

gulp.task('manifest', function() {
  // gulp.src() strips the leading directory when, e.g. assets/**
  // is used, so have to do more of a blacklist solution than a
  // whitelist.
  gulp.src([
          '**/*.{css,gif,html,js,json,png,svg,woff}',
          '!AppEngine/**', '!tests/**', '!node_modules/**'])
      .pipe(manifest({
          exclude: ['cache.manifest', 'gulpfile.js'],
          filename: 'cache.manifest',
          timestamp: false,
          hash: true}))
      .pipe(gulp.dest(''));
});