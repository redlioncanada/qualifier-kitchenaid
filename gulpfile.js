// Gulp configuration

var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var jshint      = require('gulp-jshint');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var sass        = require('gulp-sass');
var replace     = require('gulp-replace');
var concat      = require('gulp-concat');
var sourcemaps  = require('gulp-sourcemaps')
var jasmine     = require('gulp-jasmine');
var imagemin    = require('gulp-imagemin');
var preprocess  = require('gulp-preprocess');
var stripDebug  = require('gulp-strip-debug');

// Jasmine
gulp.task('test', function () {
  gulp.src('./tests/*.js')
    .pipe(jasmine());
});

// Gulp Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream:true}));
});

// process JS files and return the stream.
gulp.task('js', function () {
    var env = 'development';
    return gulp.src('app/js/**/*.js')
        .pipe(preprocess({context: {ENV: env}}))
        .pipe(gulp.dest('build/js'));
});

// process JS files and return the stream.
gulp.task('js-prod', function () {
    var env = 'production';
    return gulp.src('app/js/**/*.js')
        .pipe(stripDebug())
        .pipe(preprocess({context: {ENV: env}}))
        .on('error',function(e){
            console.log(e)
            console.log(e.stack)
        })
        .pipe(sourcemaps.init())
        .pipe(concat('qualifier.js'))
        .pipe(uglify({'mangle':false}))
        .on('error',function(e){
            console.log(e)
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        .pipe(replace('.locale = "en_CA", ".locale = "fr_CA"'))
        .pipe(gulp.dest('build/fr/js'));
});

// process Components JS files and return the stream.
gulp.task('components', function () {

    gulp.src('app/components/*/*/*/*.png')
        .pipe(gulp.dest('build/components'));

    gulp.src('app/components/*/*/*.css')
        .pipe(gulp.dest('build/components'));

    gulp.src('app/components/*/*/*/*.css')
        .pipe(gulp.dest('build/components'));

    return gulp.src('app/components/**/*.js')
        .pipe(gulp.dest('build/components'));
    
});

// process Components JS files and return the stream.
gulp.task('config', function () {
    return gulp.src('app/config/*.json')
        .pipe(gulp.dest('build/config'));
});


// Views task
gulp.task('views', function() {
    var env = 'development';

    // Get our index.html
    gulp.src('app/index.html')
    .pipe(preprocess({context: {ENV: env}}))
    // And put it in the build folder
    .pipe(gulp.dest('build/'))
    .pipe(replace('footer.html', 'footer_fr.html'))
    .pipe(replace('header.html', 'header_fr.html'))
    .pipe(replace('"en"', '"fr"'))
    .pipe(gulp.dest('build/fr/'));

    gulp.src('app/js/app.js')
    .pipe(replace(".locale = 'en_CA'", ".locale = 'fr_CA'"))
    .pipe(gulp.dest('build/fr/js'));

    // Any other view files from app/views
    gulp.src('app/views/**/*')
    // Will be put in the build/views folder
    .pipe(gulp.dest('build/views/'));
});

// Views task
gulp.task('views-prod', function() {
    var env = 'production';

    // Get our index.html
    gulp.src('app/index.html')
    .pipe(preprocess({context: {ENV: env}}))
    // And put it in the build folder
    .pipe(gulp.dest('build/'))
    .pipe(replace('footer.html', 'footer_fr.html'))
    .pipe(replace('header.html', 'header_fr.html'))
    .pipe(replace('"en"', '"fr"'))
    .pipe(gulp.dest('build/fr/'));

    // Do the same for French
    // Move /fr/index.html to / to deploy as French
    gulp.src('app/js/app.js')
    .pipe(replace(".locale = 'en_CA'", ".locale = 'fr_CA'"))
    .pipe(gulp.dest('build/fr/js'));

    // Any other view files from app/views
    gulp.src('app/views/**/*')
    .pipe(preprocess({context: {ENV: env}}))
    // Will be put in the build/views folder
    .pipe(gulp.dest('build/views/'));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/img/*/*')
    .pipe(gulp.dest('build/img/'));
});

// Images
gulp.task('images-prod', function() {
  return gulp.src('app/img/*/*')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('build/img/'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src('app/fonts/*')
    .pipe(gulp.dest('build/fonts/'));
});

// Static server
gulp.task('default', ['frontloaded-tasks'], function() {
    browserSync({
        server: {
            baseDir: "build"
        }
    });

    gulp.watch('app/scss/**/*.scss', ['sass', browserSync.reload]);
    gulp.watch('app/views/**/*.html', ['views', browserSync.reload]);
    gulp.watch('app/js/**/*.js', ['js', browserSync.reload]);
});

gulp.task('prod', ['sass', 'js-prod', 'images-prod', 'fonts', 'components', 'config', 'views-prod'], function() {
    browserSync({
        server: {
            baseDir: "build"
        }
    });

    gulp.watch('app/scss/**/*.scss', ['sass', browserSync.reload]);
    gulp.watch('app/views/**/*.html', ['views', browserSync.reload]);
    gulp.watch('app/js/**/*.js', ['js', browserSync.reload]);
});

gulp.task('frontloaded-tasks', ['sass', 'js', 'images', 'fonts', 'components', 'config', 'views'], function () {
	
    //complete all these tasks before running browsersync

});











