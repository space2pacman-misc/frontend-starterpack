'use strict';

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    rigger = require("gulp-rigger"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    watch = require("gulp-watch"),
    rimraf = require("rimraf"),
    sourcemaps = require("gulp-sourcemaps"),
    cssmin = require("gulp-clean-css"),
    ftp = require("gulp-ftp"),
    json = require("gulp-json-transform"),
    browsersync = require("browser-sync"),
    reload = browsersync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: 'build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "browsersync"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify().on('error', function (e) {
            console.log(e.message)
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false,
            remove: true
        }))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build',
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('browsersync', function () {
    browsersync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('_ftp', function () {
    var ftpjson = require('./ftp.json');
    return gulp.src('build/**')
               .pipe(ftp({
                   host: ftpjson.host,
                   user: ftpjson.user,
                   pass: ftpjson.pass,
                   remotePath: ftpjson.remotePath
               }));
});


gulp.task('_default', ['build', 'browsersync', 'watch']);