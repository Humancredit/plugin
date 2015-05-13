var gulp = require('gulp');
var execSync = require('exec-sync');
var child = null;

/**
 * build HC chromium package on top of the original uBlock Origin sources.
 */
gulp.task('build', function() {
    // cleanup
    try {
        execSync('rm -R build');
    }
    catch (e) {
    }

    // copy ublock sources
    execSync('cp -R ublock build');

    // override with plugin sources
    execSync('rsync -av plugin/src/ build/src/');
    execSync('rsync -av plugin/tools/ build/tools/');
    execSync('rsync -av plugin/platform/ build/platform/');

    // build extension
    execSync('cd build && tools/make-chromium.sh'); // all');
    //execSync('cd build && tools/make-firefox.sh all');
});

/**
 * watch for changes in plugin
 */
gulp.task('default', ['build'], function() {
    var pluginSrcGlob = 'plugin/**';
    var watcher = gulp.watch(pluginSrcGlob, ['build']);
    // watch the same files in our scripts task
    watcher.on('change', function(event) {
        console.log("plugin src changed");
    });
});
