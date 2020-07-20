import ramda from "ramda";
import {BumpupData, BumpupPlugin} from "@bumpup/lib";
import {trace} from "@bumpup/fp";
import winston from 'winston';
import symbols from 'log-symbols';
const {pipe, prop} = ramda;
const lift2 = f => g => h => x => f(g(x))(h(x));
export const applyFnToObj = (fn: (obj: Record<string, unknown>) => unknown, key: string) => (obj: Record<string, unknown>): Record<string, unknown> => ({
    ...obj,
    [key]: fn(obj)
})

const split = version => version.split('.').map(x => parseInt(x))

const increase = type => version => {
    if (type === 'patch') {
        version[2]++;
    }
    if (type === 'minor') {
        version[2] = 0;
        version[1]++;
    }
    if (type === 'major') {
        version[2] = 0;
        version[1] = 0;
        version[0]++;
    }
    return version;
}

export const join = (version: string[]): string => version.map(x => x.toString()).join('.');

export const determine = lift2((type: string): (string) => string => pipe(split, increase(type), join),)(prop('type'))(prop('version'));
export const step: BumpupPlugin = (options: {logLevel: string}) => pipe(applyFnToObj(determine, 'newVersion'),(()=>{
    const logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    })
    return trace((data: BumpupData) => logger.info(`${symbols.info} ${data.newVersion !== data.version ? `new version is ${data.newVersion}` : `no new version`}`));
})())
