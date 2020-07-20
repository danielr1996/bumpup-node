import * as fs from 'fs';
import {flow, trace} from "@bumpup/fp";
import {BumpupData, BumpupPlugin} from "@bumpup/lib";
import winston from 'winston';
import symbols from 'log-symbols';

export const readPackageJson = (): string => fs.readFileSync('package.json', {encoding: 'utf8', flag: 'r'});

export const parsePackageJson: (packageJson: string) => { version: string } = packageJson => JSON.parse(packageJson);

export const extractVersion: (packageJson: { version: string }) => { version: string } = packageJson => ({version: packageJson.version});
export const log: (logLevel: string) => (u: unknown) => unknown = logLevel => trace((data: BumpupData) => {
    const logger = winston.createLogger({
        level: logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    })
    logger.info(`${symbols.info} current version is ${data.version}`)
})
export const version: BumpupPlugin = ({logLevel}) => flow(readPackageJson, parsePackageJson, extractVersion, log(logLevel as string))