import gulp from 'gulp'
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';


const builddirs = dir => fs.readdirSync(dir, {withFileTypes: true})
    .filter(direntry => direntry.isDirectory())
    .map(direntry => path.join(dir, direntry.name));

const packagedirs = ['core/fp', 'core/lib', 'core/cli'].concat(builddirs('plugins'));


const task = task => cb => {
    task();
    cb();
}
const doInDir = fn => dir => {
    const cwd = process.cwd();
    process.chdir(dir);
    fn(process.cwd());
    process.chdir(cwd);
}


const install = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm install').toString());
}));

const ci = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm ci').toString());
}));

const test = () => {
    console.log(child_process.execSync(`jest --bail --silent --colors --projects ${packagedirs.join(' ')}`).toString())
}
const build = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm run build').toString());
}));
const version = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('git log --oneline .').toString());
    console.log(child_process.execSync('npm run version').toString());
}));
const publish = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm publish --access=public').toString());
}));

gulp.task('install', task(install));
gulp.task('ci', task(ci));
gulp.task('test', task(test));
gulp.task('build', task(build));
gulp.task('version', task(version));
gulp.task('publish', task(publish));
