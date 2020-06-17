import * as fs from "fs";
import {flow} from "@bumpup/fp";

export const bump = newVersion => {
    if (newVersion !== null) {
        const packageJson = flow(readPackageJson, parsePackageJson)();
        packageJson.version = newVersion;
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
        return {status: 'success', message: `👊 Bumping version ${newVersion}`};
    } else {
        return {status: 'success', message: '👊 Nothing changed. Not bumping'};
    }
};

const readPackageJson = () => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);