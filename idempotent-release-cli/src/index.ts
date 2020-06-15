// @ts-ignore
import {release} from "idempotent-release-lib/dist/index.cjs";
// @ts-ignore
import {flow, log} from "idempotent-release-fp/dist/index.cjs";
import * as fs from "fs";

const bump = version=>console.log('New Version: '+version);

const readJson = () => fs.readFileSync('idempotent-release.json');

const parseJson = json => JSON.parse(json);

const extractVersionReader = config => config.read[0].reader;
const extractTypeReader = config => config.type[0].reader;
const extractVersionDeterminer = config => config.determine[0].determiner;

const getVersionReader = flow(readJson, parseJson, extractVersionReader);
const getTypeReader = flow(readJson, parseJson, extractTypeReader);
const getDeterminer = flow(readJson, parseJson, extractVersionDeterminer);

async function importReader(){
    const versionReader = await import(`${getVersionReader()}/dist/index.cjs`);
    const typeReader = await import(`${getTypeReader()}/dist/index.cjs`);
    const versionDeterminer = await import(`${getDeterminer()}/dist/index.cjs`)
    const getLastVersion = flow(versionReader.getLastVersion, log('Read Version'));
    const getType = flow(typeReader.getType, log('Read Type'));
    const determine = flow(versionDeterminer.determine)
    const idr = release(getLastVersion)(getType)(determine)(bump);
    idr();
}
importReader();


