// Gulp configuration

/*
for auth, create a file in the same dir as this one named .ftppass with the structure
{
  "keyMain": {
    "user": "username",
    "pass": "password"
  }
}
*/

var gulp = require('gulp');
var ftp = require('gulp-sftp');
var replace = require('gulp-replace');
var p = require('../package.json');

var basePath = '/home/wpcstage/mykitchenaid/';
var versionPath = '/home/wpcstage/mykitchenaid/latest/';
var opts = {host: 'wpc-stage.com', port: 22, auth: 'keyMain'};
var baseURL = 'http://mykitchenaid.wpc-stage.com';

gulp.task('default', ['version', 'lastupdated'], function() {
    doUpload(['config', 'css', 'fonts', 'js', 'views']);
});

gulp.task('components', ['version', 'lastupdated'], function() {
    doUpload(['components', 'img']);
});

gulp.task('all', ['version', 'lastupdated'], function() {
    doUpload(['config', 'css', 'fonts', 'js', 'views', 'components', 'img']);
});

gulp.task('production', ['version'], function() {
    doUpload(['config', 'css', 'fonts', 'js', 'views', 'components', 'img']);
});

gulp.task('version', function() {
    opts.remotePath = versionPath;

    return gulp.src('index.php')
        .pipe(replace('#LOCATION', baseURL+'/'+p.version))
        .pipe(ftp(opts));
});

gulp.task('lastupdated', function() {
    var styles = "position:fixed;color:black;bottom:0;z-index:5000;font-size:12px;";
    return gulp.src('../build/index.html')
        .pipe(replace('<!-- #LASTUPDATED -->', '<p style="' + styles + '" class="lastupdated">Last updated: ' + new Date() + '</p>'))
        .pipe(gulp.dest('../build'));
});

function doUpload(src) {
    for (var i in src) {
        opts.remotePath = basePath+p.version+'/'+src[i];
        gulp.src('../build/'+src[i]+'/**')
            .pipe(ftp(opts));
    }
    
    opts.remotePath = basePath+p.version;
    return gulp.src('../build/*')
        .pipe(ftp(opts));
}











