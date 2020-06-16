import gulp from 'gulp'
import * as fs from 'fs';

const packagedirs = ['core', 'plugins'];

const builddirs = packagedirs
    .flatMap(dir => fs.readdirSync(dir, {withFileTypes: true})
        .filter(direntry => direntry.isDirectory())
        .map(direntry => direntry.name));

const task = task=>cb=>{
    task();
    cb();
}

const install = () => console.log(builddirs);
const test = () => console.log('Test');
const build = () => console.log('Build');
const version = () => console.log('Version');
const publish = () => console.log('Publish');

gulp.task('install', task(install));
gulp.task('test', task(build));
gulp.task('build', task(build));
gulp.task('version', task(build));
gulp.task('publish', task(build));
