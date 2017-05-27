var gulp = require("gulp"),
    sass = require("gulp-sass"),
    rigger = require("gulp-rigger"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer"),
    watch = require("gulp-watch"),
    rimraf = require("rimraf"),
    imgmin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant"),
    sourcemaps = require("gulp-sourcemaps"),
    cssmin = require("gulp-clean-css"),
    browsersync = require("browser-sync"),
    reload = browsersync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        libs: 'build/libs',
        css: 'build/css/',
        csslibs: 'build/css/libs',
        img: 'build/img/',
        libs: 'build/libs/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/main.js',
        libs: 'src/libs/**/*.js',
        style: 'src/style/*.scss',
        csslibs: 'src/style/libs/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        libs: 'src/libs/**/*.js',
        style: 'src/style/**/*.scss',
        csslibs: 'src/style/libs/*.css',
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
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
})

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('libs:build', function () {
    gulp.src(path.src.libs)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.libs))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.src.csslibs)
        .pipe(sass({
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(gulp.dest(path.build.csslibs))
        .pipe(reload({stream: true}));
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
        .pipe(imgmin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'libs:build',
    'style:build',
    'css:build',
    'image:build',
    'fonts:build',
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.csslibs], function (event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.libs], function (event, cb) {
        gulp.start('js:build');
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

gulp.task('_default', ['build', 'browsersync', 'watch']);