import * as fs from 'fs';
// @ts-ignore
import {flow} from "idempotent-release-fp/dist/index.cjs";

const readFile = () => fs.readFileSync('version.txt', {encoding: 'utf8', flag: 'r'});

const parseFile = fileContents => fileContents.trim();

export const getLastVersion = flow(readFile, parseFile);


