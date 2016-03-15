var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var merge = require('merge2');
var concat = require('gulp-concat');

gulp.task('default', ['uglify', 'css']);

gulp.task('compile', function() {
  var result = gulp.src('src/ModalBox.ts')
      .pipe(ts({
        declaration: true,
        out: 'bin/ModalBox.js',
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

gulp.task('css', function () {
  return gulp.src('src/modalBox.css')
      .pipe(gulp.dest('bin/'))
})

// TODO Some tests would be nice...
gulp.task('test', function() {
  return;
})