import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import winston from 'winston';
import symbols from 'log-symbols';
import {formatter} from "../bump/bump";

export const defaultConfig =
    `import version from '@bumpup/version-package-json';
import {type, record} from '@bumpup/type-git-tags';
import bump from '@bumpup/bump-package-json';
import determine from '@bumpup/determine-semver';

export default {
    version: "2.0.0",
    plugins: [
        version,
        type,
        determine,
        bump,
        record,
    ]
}`

type InitOptions = {
    file: string,
    dry: boolean,
    saveProd: boolean,
    skipInstall: boolean,
}
const logger = winston.createLogger({
    format: winston.format.printf(formatter),
    transports: [new winston.transports.Console()]
});

export const init: (options: InitOptions) => void = async options => {
    if (!options.skipInstall) {
        installPackages(options);
    }
    return writeConfig(options);
}

export const installPackages: (options: InitOptions) => void = async ({dry, saveProd}) => {
    if (dry) {
        logger.info(`${symbols.info} not installing packages with npm because --dry was specified`)
        return;
    }
    logger.info(`${symbols.info} installing packages with npm`)
    child_process.execSync(`npm install ${saveProd ? '-P' : '-D'} @bumpup/version-package-json @bumpup/determine-semver @bumpup/bump-package-json @bumpup/type-git-tags`, {stdio: 'inherit'});

}
export const writeConfig: (options: InitOptions) => void = async ({dry, file}) => {
    if(dry){
        logger.info(`${symbols.info} not writing file because --dry is specified`);
        logger.info(defaultConfig);
        return Promise.resolve();
    }
    return await fs.promises.writeFile(path.resolve(process.cwd(), file), defaultConfig, 'utf-8').then(()=>{
        logger.info(`${symbols.info} config file written to ${file}`)
    });
}