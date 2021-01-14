import gulp from 'gulp'
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import md5 from 'md5';
import glob from 'glob';

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

const lint = () =>{
    console.log(child_process.execSync('npx eslint .').toString())
}

const test = () => {
    console.log(child_process.execSync(`jest --silent --colors`).toString())
}

const build = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm run build').toString());
}));

const checksum = () => packagedirs.forEach(dir=>{
    const files = glob.sync(`${dir}/dist/**/*`,{nodir: true});
    fs.writeFileSync(`${dir}/build.md5sum`, md5(files.map(name=>({name, hash: md5(fs.readFileSync(name))})).sort(file=>file.name).map(file=>file.hash).join(' ')));
});

const version = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm run version').toString());
}));

const prerelease = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm run version -- -p').toString());
}));

const versionDry = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm run version -- --dry').toString());
}));
const publish = () => packagedirs.forEach(doInDir(dir => {
    console.log(child_process.execSync('npm publish --access=public & exit 0').toString());
}));

gulp.task('install', task(install));
gulp.task('ci', task(ci));
gulp.task('lint', task(lint));
gulp.task('test', task(test));
gulp.task('build', task(build));
gulp.task('checksum', task(checksum))
gulp.task('version', task(version));
gulp.task('prerelease', task(prerelease));
gulp.task('version:dry', task(versionDry));
gulp.task('publish', task(publish));
