import gulp from 'gulp'
import * as fs from 'fs';
import * as path from 'path';
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

const checksum = () => packagedirs.forEach(dir=>{
    const files = glob.sync(`${dir}/dist/**/*`,{nodir: true});
    fs.writeFileSync(`${dir}/build.md5sum`, md5(files.map(name=>({name, hash: md5(fs.readFileSync(name))})).sort(file=>file.name).map(file=>file.hash).join(' ')));
});
gulp.task('checksum', task(checksum))
