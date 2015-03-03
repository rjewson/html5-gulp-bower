var gulp        = require('gulp'),
    gulputil    = require('gulp-util'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    watchify    = require('watchify'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourceMaps  = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    babel       = require('gulp-babel'),
    concat      = require('gulp-concat'),
    wireDep     = require('wiredep').stream;

var src = './src';
var dest = './build';

var config = {
    browserSync: {
        server: {
            baseDir: dest,
            routes: {
                "/bower_components": "bower_components"
            }
        }
    },
    sass: {
        src: src+'/sass/*.{sass,scss}',
        dest: dest,
        settings: {
            //indentedSyntax: true,
            errLogToConsole: true
        }
    },
    markup: {
        src: src+'/htdocs/**',
        dest: dest
    },
    watchify: {
        src: src+'/js/global.js',
        dest: dest
    },
    babel: {
        src: src+'/js/**/*.js',
        dest: dest
    }
}

function onError(error) {
    console.log(error);
}

function onEnd(filepath) {
    //gulputil.log('Bundled', gulputil.colors.green(filepath)); 
}

// \/ Yikes \/
// //Watchify stuff
// //https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// var bundler = watchify(browserify(config.watchify.src, watchify.args));
// // add any other browserify options or transforms here
// //bundler.transform('brfs');

// gulp.task('js', bundle);
// bundler.on('update', bundle);

// function bundle() {
//   return bundler.bundle()
//     // log errors if they happen
//     .on('error', gulputil.log.bind(gulputil, 'Browserify Error'))
//     .pipe(source('bundle.js'))
//     // optional, remove if you dont want sourcemaps
//       .pipe(buffer())
//       .pipe(sourceMaps.init({loadMaps: true})) // loads map from browserify file
//       .pipe(sourceMaps.write()) // writes .map file
//     //
//     .pipe(gulp.dest(config.watchify.dest));
// }

gulp.task('babel', function () {
  return gulp.src(config.babel.src)
    .pipe(sourceMaps.init())
    .pipe(concat("all.js"))
    .pipe(babel())
    .pipe(sourceMaps.write("."))
    .pipe(gulp.dest(config.babel.dest));
});

//Standard SASS task
gulp.task('sass', function(){
    return gulp.src(config.sass.src)
        .pipe(sourceMaps.init())
        .pipe(sass(config.sass.settings))
        .on('error',onError)
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.reload({stream:true}));
});

//Copies html etc files from source to dest
gulp.task('markup',function(){
    return gulp.src(config.markup.src)
        .pipe(wireDep({
            
        }))
        .pipe(gulp.dest(config.markup.dest))
        .pipe(browserSync.reload({stream:true}));
});

// gulp.task('bower',function(){
//     return gulp.src(config.markup.src)
//         .pipe(wireDep({
//             {}
//         }))
// });

//Starts browserSync, then called from other tasks
gulp.task('browserSync',function(){
    browserSync(config.browserSync);
});

//Setup the watches
gulp.task('watch',['browserSync'],function(){
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.markup.src, ['markup']);
    gulp.watch(config.babel.src, ['babel']);
});

//Start it all
gulp.task('default',['sass','markup','babel','watch']);
