import {BumpupData} from "@bumpup/lib";
import winston from 'winston';
import symbols from 'log-symbols';
import semver, {ReleaseType} from 'semver';

export const determine: (options: { dry?: boolean, pre?: boolean, logLevel: string }) => (data: BumpupData) => BumpupData = options => data => {
    const logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    })
    let returnData;
    if (data.type === 'none') {
        returnData = {...data, newVersion: data.version};
    } else {
        const releaseIdentifier = options.pre ? `pre${data.type}` : data.type;
        returnData = {...data, newVersion: semver.inc(data.version, releaseIdentifier as ReleaseType)};
    }
    logger.info(`${symbols.info} ${returnData.newVersion !== returnData.version ? `new version is ${returnData.newVersion}` : `no new version`}`)

    return returnData;
};