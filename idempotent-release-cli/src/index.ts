import {configure} from "idempotent-release-lib";
import {flow} from "idempotent-release-fp";
import * as fs from "fs";

const getChangeType = () => 'feat';
const getNewVersion = changeType => lastVersion => changeType === 'fix' ? '1.0.2' : '1.1.0';
const bump = newVersion => newVersion;
// const getLastVersion = () => '1.0.0'


const readJson = () => fs.readFileSync('idempotent-release.json');

const parseJson = json => JSON.parse(json);

const extractReader = config => config.read[0].reader;

const getReader = flow(readJson, parseJson, extractReader);

async function importReader(){
    const imp = await import(getReader());
    const getLastVersion = imp.getLastVersion;
    const idr = configure(getLastVersion,getChangeType,getNewVersion, bump);
    console.log(idr());
}
importReader();


