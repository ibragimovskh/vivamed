import { src, dest, watch, parallel, series } from "gulp";
import babel from "gulp-babel";
import cleanCSS from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";
import scss from "gulp-sass";
import concat from "gulp-concat";
import imagemin from "gulp-image";
import uglify from "gulp-uglify-es";
import htmlmin from "gulp-htmlmin";
import plumber from "gulp-plumber";
import gcmq from "gulp-group-css-media-queries";
import rigger from "gulp-rigger";
import del from "del";
import browserSync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import browserify from "gulp-browserify";
// Instead of BrowserSync.reload
let { reload } = browserSync;
let path = {
  html: {
    src: "./src/html/index.html",
    build: "./build/",
    watch: "./src/**/*.html"
  },
  styles: {
    src: "./src/styles/main.scss",
    build: "./build/styles/",
    watch: "./src/styles/**/*.scss"
  },
  scripts: {
    src: "./src/js/*.js",
    build: "./build/js/",
    watch: "./src/js/**/*.js"
  },
  images: {
    src: "./src/img/**/*.*",
    build: "./build/img/",
    watch: "./src/img/**/*.*"
  },
  fonts: {
    src: "./src/fonts/**/*.*",
    build: "./build/fonts/",
    watch: "./src/fonts/**/*.*"
  },
  clean: "./build"
};

/* Local server configuration */
const config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: "localhost"
};

let clean = cb => {
  del(["./build/*"]);
  cb();
};

let html = () => {
  return src(path.html.src)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.html.build))
    .pipe(reload({ stream: true }));
};

let styles = () => {
  return src(path.styles.src)
    .pipe(plumber())
    .pipe(scss())
    .pipe(gcmq())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(cleanCSS())
    .pipe(dest(path.styles.build))
    .pipe(reload({ stream: true }));
};

let scripts = () => {
  return src(path.scripts.src)
    .pipe(plumber())
    .pipe(browserify())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(path.scripts.build))
    .pipe(reload({ stream: true }));
};

let images = () => {
  return src(path.images.src)
    .pipe(imagemin())
    .pipe(dest(path.images.build));
};

let fonts = () => {
  return src(path.fonts.src).pipe(dest(path.fonts.build));
};

let watcher = () => {
  watch(path.styles.watch, styles);
  watch(path.scripts.watch, scripts);
  watch(path.fonts.watch, fonts);
  watch(path.images.watch, images);
  watch(path.html.watch, html);
  browserSync.init(config);
  watch(path.html.watch).on("change", () => reload());
};

let build = series(
  series(clean, html),
  series(parallel(scripts, styles), parallel(images, fonts))
);
exports.build = build;
exports.default = series(build, watcher);
// exports.default = build;
