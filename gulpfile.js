import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';


// копирование нужных файлов в папку build;
const copyImages = function() {
  return gulp.src('source/img/**/*.{jpg, png}')
    .pipe(gulp.dest('build/img'));
}

const copy = function() {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico',
    'source/manifest.webmanifest',
  ], {base: 'source'})
    .pipe(gulp.dest('build'));
}

const html = function() {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

const scripts = function() {
  return gulp.src('source/js/script.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'));
}

// очистка
const clean = function() {
  return deleteAsync('build');
}


const svg = function() {
  return gulp.src('source/img/**/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'))
}

// сборка спрайтов
const sprite = function() {
  return gulp.src('source/img/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}


// оптимизация изображений
const optimizeImages = function() {
  return gulp.src('source/img/**/*.{jpg, png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const createWebp = function () {
  return gulp.src('source/img/**/*.{jpg, png}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

// Styles
export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso() // минификация стилей
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
}

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/script.js', gulp.series(scripts));
}

// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  )
);

// Default: Start
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
