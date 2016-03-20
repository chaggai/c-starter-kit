/**
 * Created by chagg on 3/19/2016.
 */
'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    lost = require('lost'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    package_json = require('./package.json');

// Add header to files
var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * @author: <%= package.author %>\n' +
    ' * @email: <%= package.email %>\n' +
    ' * @homepage: <%= package.homepage %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

// Static server + watching sass/html files
gulp.task('serve', ['styles'], function () {
    browserSync.init ({
        server: {
            baseDir: 'dist/'
        }
    });
    gulp.watch('src/sass/**/*.sass', ['styles']);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function () {
    return gulp.src('src/sass/main.sass')
        .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
        .pipe(postcss([
            autoprefixer('last 2 versions'),
            lost
        ]))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(header(banner, {package: package_json}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('default', ['serve']);