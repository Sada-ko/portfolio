var gulp       = require('gulp'),
sass           = require('gulp-sass'),
cssnano        = require('gulp-cssnano'),
rename         = require('gulp-rename'),
del            = require('del'), // Подключаем библиотеку для удаления файлов и папок
autoprefixer   = require('gulp-autoprefixer'),
rigger         = require('gulp-rigger'), //склеивает файлы
cssimport      = require('gulp-cssimport'), //склеивает файлы с css
cache          = require('gulp-cache'), // модуль для кэширования
browserSync    = require('browser-sync'),
imagemin       = require('gulp-imagemin'); // плагин для сжатия PNG, JPEG, GIF и SVG изображений
jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg
pngquant       = require('imagemin-pngquant'), // плагин для сжатия png
uglify         = require('gulp-uglify'), // модуль для минимизации JavaScript
sourcemaps     = require('gulp-sourcemaps'),

// Объект переменная с путями
path = {

//Тут мы укажем куда складывать готовые после сборки файлы
build: {
	html : 'build/',
	js : 'build/js/',
	css : 'build/css/',
	img: 'build/img/',
	fonts: 'build/fonts/'
},

//Пути откуда брать исходники
src: {
	html : 'app/*.html',
js : 'app/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
style: 'app/css/scss/main.scss',
img: 'app/img/**/*.*',
fonts: 'app/fonts/**/*.*'
},

//Тут мы укажем, за изменением каких файлов мы хотим наблюдать
watch: {
	html : 'app/**/*.html',
	js : 'app/js/**/*.js',
	style: 'app/css/**/*.scss',
	img: 'app/img/**/*.*',
	fonts: 'app/fonts/**/*.*'
},
clean: './build'
};

// Сервер, настройкa
gulp.task('browser-sync', function () {
	browserSync({
		server: {
baseDir: 'build' // Отсюда работает сервер
},
notify: false,
browser: "firefox"
});
});
// Styles build​
gulp.task('style:build', function () {
	
	gulp.src(path.src.style)
	.pipe(sourcemaps.init())

	.pipe(sass()) 

//Скомпилируем
.pipe(cssimport())
.pipe(autoprefixer({
	browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
	cascade: true

})) 

//Добавим вендорные префиксы
.pipe(cssnano())
.pipe(sourcemaps.write())
.pipe(rename({suffix: '.min'}))
.pipe(gulp.dest(path.build.css)) //И в build
.pipe(browserSync.reload({stream: true}));
});

// JS build
gulp.task('js:build', function () {
gulp.src(path.src.js) //Найдем наш main файл
.pipe(rigger()) //Прогоним через rigger
.pipe(uglify())
.pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
.pipe(browserSync.reload({stream: true})); //И перезагрузим сервер})
});

// обработка картинок
gulp.task('image:build', function () {
gulp.src(path.src.img) // путь с исходниками картинок
.pipe(cache(imagemin([ // сжатие изображений
	imagemin.gifsicle({interlaced: true}),
	jpegrecompress({
		progressive: true,
		max: 90,
		min: 51
	}),
	pngquant(),
	imagemin.svgo({plugins: [{removeViewBox: false}]})
	])))
.pipe(gulp.dest(path.build.img)) // выгрузка готовых файлов
.pipe(browserSync.reload({stream: true})); //И перезагрузим сервер})
});

// HTML build
gulp.task('html:build', function () {
gulp.src(path.src.html) //Выберем файлы по нужному пути
.pipe(rigger()) //Прогоним через rigger
.pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
.pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

// удаление каталога build
gulp.task('clean:build', function () {
	del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function () {
	cache.clearAll();
});
gulp.task('build', [
// 'clean:build',
'style:build',
'js:build',
'image:build',
'html:build'
]);
gulp.task('watch', ['browser-sync'], function () {
	gulp.watch([path.watch.style], ['style:build']);
	gulp.watch(path.watch.img, ['image:build']);
	gulp.watch([path.watch.html], ['html:build']);
	gulp.watch([path.watch.js], ['js:build']);
});

// задача по умолчанию
gulp.task('default', [
	'clean:build',
	'build',
	'watch'
	]);