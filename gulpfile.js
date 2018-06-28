var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
// var fontello = require('gulp-fontello');
// var concatCss = require('gulp-concat-css');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');

//plumber error

var onError = function (err) {
  console.log(err);
};

//inject

gulp.task('index', ['pug'], function() {
    return gulp.src('dist/**/*.html')
        .pipe(inject(gulp.src('dist/**/*.css', { read: false }), { relative: true, ignorePath: 'dist', addRootSlash: false, name: 'styles' }))
        .pipe(inject(gulp.src('dist/**/*.js', { read: false }), { relative: true, ignorePath: 'dist', addRootSlash: false, name: 'scripts' }))
        .pipe(gulp.dest('dist/'));
});

// Fontello

// var options = {
//     font: './dist/fonts/',
//     css: './dev/scss/fontello/'
// }

// gulp.task('fontello', function() {
//     return gulp.src('./dev/fonts/config.json')
//         .pipe(fontello(options))
//         .pipe(gulp.dest('./'));

// });


// SCSS

gulp.task('scss', function() {
    return gulp.src('dev/scss/styles.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({
            outputStyle: 'compressed'
            // includePaths: ['node_modules/susy/sass']
            // outputStyle: 'expanded'
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        // .pipe(concatCss('./style.css'))
        // .pipe(replace('.././dist/fonts//', './fonts/'))
        .pipe(gulp.dest('dist/'))
        // .pipe(browserSync.stream());
        .pipe(browserSync.reload({ stream: true }));
});

// JS

gulp.task('js', function() {
    return gulp.src('dev/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
})

// PUG

gulp.task('pug', function() {
    return gulp.src(['dev/pug/**/*.pug', '!dev/pug/parts/**/*.pug'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(pug({
            // pretty: true
        }))
        .pipe(gulp.dest('dist/'))
        // .pipe(browserSync.stream());
        .pipe(browserSync.reload({ stream: true }));
})

//browser sync

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        },
        open: false
    })
})

gulp.task('default', ['scss', 'js', 'index', 'serve'], function() {
    gulp.watch('**/*.scss', { cwd: 'dev/scss' }, ['scss', 'index']);
    gulp.watch('**/*.pug', { cwd: 'dev/pug' }, ['pug', 'index']);
    gulp.watch('**/*.js', { cwd: 'dev/js' }, ['js', 'index']);
});