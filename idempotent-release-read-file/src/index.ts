import * as fs from 'fs';
import {flow} from "idempotent-release-fp";

const readFile = () => fs.readFileSync('version.txt', {encoding: 'utf8', flag: 'r'});

const parseFile = fileContents => fileContents.trim();

export const getLastVersion = flow(readFile, parseFile);


