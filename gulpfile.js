var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

//编译sass文件
gulp.task('sass', function(){
  return gulp.src('src/sass/*.scss')
  .pipe(sass())
	.pipe(gulp.dest('src/css/'))
})

// 合并、压缩、重命名css
gulp.task('css', function() {
	var processors = [px2rem({remUnit: 75})];
	return gulp.src('src/css/*.css')
		.pipe(postcss(processors))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(concat('all.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
		.pipe(notify({
			message: 'css task ok'
		}));
});

// 合并、压缩js文件
gulp.task('js', function() {
	return gulp.src('src/js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({
			message: 'js task ok'
		}));
});

// 压缩图片
gulp.task('img', function() {
	return gulp.src('src/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({
			message: 'img task ok'
		}));
});

gulp.task('watch', function(){
	gulp.watch('src/sass/*scss', ['sass']);
	gulp.watch('src/css/*.css', ['css']);
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/images/*', ['img']);
});

// 默认任务
gulp.task('default', function() {
  gulp.run('sass', 'css', 'js', 'img', 'watch');
});