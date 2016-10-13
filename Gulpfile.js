var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// config
var argv = require('yargs').argv;
var ngConstant  = require('gulp-ng-constant');

// build
var del = require('del');
var jspm = require('gulp-jspm');
var htmlreplace = require('gulp-html-replace');

// vars
var enviroment = argv.env || 'development';
var staticDir = argv.path || 'dist';

var src = {
    scss: 'app/scss/*.scss',
    css:  'app/css',
    html: 'app/**/*.html'
};

gulp.task('config', function () {
    console.log('Configuration file: config/' + enviroment + '/config.json');
    gulp.src('config/' + enviroment + '/config.json')
    .pipe(ngConstant({
      name: 'app.config'
    }))
    // Writes config.js to dist/ folder 
    .pipe(gulp.dest('lib'));
});

gulp.task('sass', function(){
  return gulp.src(src.scss)
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(src.css))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', ['sass', 'config'], function() {

    browserSync.init({
		server: {
			baseDir: "./",
            port: 4000,
			routes: {
				'/config.js': './config.js',
				'/jspm_packages': './jspm_packages',
				'/lib': './lib'
			}
		},
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', browserSync.reload);
});

gulp.task('build', ['config'], function() {
    del(staticDir);
    gulp.src('app/app.ts')
    .pipe(jspm({selfExecutingBundle: true})) // `jspm bundle-sfx app` 
    .pipe(gulp.dest(staticDir));
    gulp.src('app/i18n/*')
    .pipe(gulp.dest(staticDir + '/app/i18n/'));
    gulp.src('app/img/*')
    .pipe(gulp.dest(staticDir + '/app/img/'));
    gulp.src('index.html')
    .pipe(htmlreplace({
        'js': '<script src="app.bundle.ts"></script>',
        'base': '<base href="/app_webclient/">'
    }))
    .pipe(gulp.dest(staticDir));
    gulp.src('app/**/**.html')
    .pipe(gulp.dest(staticDir + '/app'));
    gulp.src('server/server.js')
    .pipe(gulp.dest(staticDir));
});
