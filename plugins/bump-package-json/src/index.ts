import * as fs from "fs";
import {flow} from "@bumpup/fp";

export const bump = newVersion=>{
    if(newVersion!==null){
        console.log('Bumping version ',newVersion);
        const packageJson = flow(readPackageJson, parsePackageJson)();
        packageJson.version = newVersion;
        fs.writeFileSync('package.json',JSON.stringify(packageJson, null, 2));
    }else{
        console.log('Nothing changed. Not bumping');
    }
};

const readPackageJson = () => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);