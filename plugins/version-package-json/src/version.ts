import * as fs from 'fs';
import {emoji, flow, trace} from "@bumpup/fp";
import {BumpupData, BumpupPlugin} from "@bumpup/lib";
import winston from 'winston';
import symbols from 'log-symbols';

const readPackageJson = (): string => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

const parsePackageJson = packageJson => JSON.parse(packageJson);

const extractVersion = packageJson => ({version: packageJson.version});
const log = (logLevel: string) => trace((data: BumpupData) => {
    const logger = winston.createLogger({
        level: logLevel,
        format: winston.format.printf(({message})=>message),
        transports: [new winston.transports.Console()]
    })
    logger.info(`${symbols.info} current version is ${data.version}`)
})
export const version: BumpupPlugin = ({logLevel}) => flow(readPackageJson, parsePackageJson, extractVersion, log(logLevel as string))