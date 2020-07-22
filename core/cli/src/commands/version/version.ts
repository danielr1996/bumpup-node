/* istanbul ignore file */
import path from 'path';
import fs from 'fs';

export const dirname: (v: string) => string = execPath => path.dirname(execPath)
export const pkgPath: (v: string) => string = dirname => path.resolve(dirname, '..', 'package.json')
export const fileContent: (v: string) => string = pkgPath => fs.readFileSync(pkgPath, 'utf-8');
export const getVersion: (v: { version: string }) => string = pkgJson => pkgJson.version;

export const version: (v: string) => string = execPath => getVersion(JSON.parse(fileContent(pkgPath(dirname(execPath)))))