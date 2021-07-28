const gulp = require('gulp')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const imagemin = require("gulp-imagemin")
const browserSync = require('browser-sync').create()
const minifyjs = require('gulp-uglify')
const minifycss = require('gulp-cssmin')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const sass = require('gulp-sass')

const FOLDER ={
    prod: 'dist/',
    dev: 'src/'
}

const path = {
    src:{
        scss: `${FOLDER.dev}**/*.scss`,
        js: `${FOLDER.dev}**/*.js`,
        img: `${FOLDER.dev}img/**/*`
    },
    build:{
        css: `${FOLDER.prod}css/`,
        js: `${FOLDER.prod}js/`,
        img: `${FOLDER.prod}img/`
    }
}

const buildCSS = () => (
    gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist:['last 10 versions'],
            cascade: false
        }))
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
)

const buildJS = () => (
    gulp.src(path.src.js)
        .pipe(concat('script.min.js'))
        .pipe(minifyjs())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
)

const buildIMG = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream())
)
const cleanBuild = () => (
    gulp.src('dist/', {allowEmpty: true})
        .pipe(clean())
);
const watcher = () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })

    gulp.watch(path.src.scss, buildCSS).on("change",browserSync.reload);
    gulp.watch(path.src.js, buildJS).on("change", browserSync.reload);
    gulp.watch(path.src.img, buildIMG).on("change", browserSync.reload);
    gulp.watch('./index.html', null).on('change', browserSync.reload);
}

gulp.task('build', gulp.series(
    cleanBuild,
    gulp.parallel(buildCSS, buildJS, buildIMG),
    watcher
))

gulp.task('dev', gulp.series('build', watcher))