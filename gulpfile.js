var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify-es').default;
var merge = require('merge2');
var concat = require('gulp-concat');

gulp.task('default', ['uglify']);

gulp.task('compile', function() {
  var result = gulp.src('src/ModalBox.ts')
      .pipe(ts({
        declaration: true,
        module: 'ES2015',
        target: 'ES5',
        noEmitOnError: true
      }))

  result.on('error', function() {
    result.emit('end');
    process.exit(1);
  })

  return merge([
    result.dts.pipe(concat('ModalBox.d.ts')).pipe(gulp.dest('bin/')),
    result.js.pipe(concat('ModalBox.js')).pipe(gulp.dest('bin/'))
  ]);
})

gulp.task('uglify', ['compile'], function() {
  return gulp.src('bin/ModalBox.js')
      .pipe(concat('ModalBox.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('bin/'))
})

// TODO Some tests would be nice...
gulp.task('test', function() {
  return;
})
