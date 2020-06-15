import * as fs from 'fs';
// @ts-ignore
import {flow} from "idempotent-release-fp/dist/index.cjs";

const readPackageJson = () => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);

const extractVersion = packageJson => packageJson.version;

export const getLastVersion = flow(readPackageJson, parsePackageJson, extractVersion);
