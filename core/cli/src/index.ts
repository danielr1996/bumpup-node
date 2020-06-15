// @ts-ignore
import {release} from "@bumpup/lib";
// @ts-ignore
import {flow, log} from "@bumpup/fp";
import * as fs from "fs";
import * as path from "path";

const readJson = () => fs.readFileSync('bumpup.json');

const parseJson = json => JSON.parse(json);

const extractVersionReader = config => config.read[0].reader;
const extractTypeReader = config => config.type[0].reader;
const extractVersionDeterminer = config => config.determine[0].determiner;
const extractBumper = config => config.bump[0].bumper;

const getVersionReader = flow(readJson, parseJson, extractVersionReader);
const getTypeReader = flow(readJson, parseJson, extractTypeReader);
const getDeterminer = flow(readJson, parseJson, extractVersionDeterminer);
const getBumper = flow(readJson, parseJson, extractBumper);

async function importReader() {
    const {getLastVersion} = await import(path.resolve('node_modules', getVersionReader()))
    const {record, getType} = await import(path.resolve('node_modules', getTypeReader()))
    const {determine} = await import(path.resolve('node_modules', getDeterminer()))
    const {bump} = await import(path.resolve('node_modules', getBumper()))
    const rel = release(getLastVersion)(getType)(determine)(bump)(record);
    rel();
}

importReader();


