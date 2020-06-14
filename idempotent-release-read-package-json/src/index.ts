import * as fs from 'fs';
import {flow} from "idempotent-release-fp";

const readPackageJson = () => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);

const extractVersion = packageJson => packageJson.version;

export const getLastVersion = flow(readPackageJson, parsePackageJson, extractVersion);
