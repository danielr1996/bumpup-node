import * as fs from 'fs';
import {emoji, flow, trace} from "@bumpup/fp";
import {BumpupData} from "@bumpup/lib";
import {BumpupPlugin} from "@bumpup/lib/src";

const readPackageJson = (): string => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);

const extractVersion = packageJson => ({version: packageJson.version});
const log = trace((data: BumpupData) => console.log(`${emoji`📖`} current version is ${data.version}`))
export const version: BumpupPlugin = () => flow(readPackageJson, parsePackageJson, extractVersion, log)