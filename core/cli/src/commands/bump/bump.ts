import {bumpup, BumpupPlugin, BumpupPluginOptions, ConfiguredBumpupPlugin} from "@bumpup/lib";
import path from "path";
import winston from 'winston';
import symbols from 'log-symbols';
import findUp from 'find-up';

export type BumpupPluginWithOptions = [BumpupPlugin, BumpupPluginOptions];

export type Config = {
    version: string,
    plugins: (BumpupPlugin | BumpupPluginWithOptions)[]
}
export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

type BumpOptions = {
    file: string,
    dry: boolean,
    log: LogLevel,
    pre?: boolean,
    preid?: string,
}
export const formatter: ({message: string}) => string = ({message}) => message;

const logger = winston.createLogger({
    format: winston.format.printf(formatter),
    transports: [new winston.transports.Console()]
})

export const findConfigFile: (filename: string) => string = filename => {
    const found = findUp.sync(filename, {cwd: process.cwd()});

    if (!findUp.sync.exists(found)) {
        logger.error(`${symbols.error} could not find config file at ${filename}`);
        const error = new Error('Config file not found')
        error['caught'] = true;
        throw error;
    }
    logger.verbose(`${symbols.info} found config file at ${found}`);

    if (found.endsWith('.mjs')) {
        return `file://${path.resolve(process.cwd(), found)}`;
    }
    return `${path.resolve(process.cwd(), found)}`
}

export const validateConfig: (config: Config) => void = config => {
    if (config.version !== '2.0.0') {
        logger.error(`${symbols.error} Config versions other than 2.0.0 are not yet supported`);
        const error = new Error('Config versions other than 2.0.0 are not yet supported')
        error['caught'] = true;
        throw error;
    }
}

export const parse: (filename: string) => Promise<Config> = async filename => {
    try {
        return (await import(filename)).default;
    } catch (e) {
        if (e.code === 'ERR_MODULE_NOT_FOUND' || e.code === 'MODULE_NOT_FOUND') {
            logger.error(`${symbols.error} Could not find ${filename}`)
            logger.debug(`${symbols.error} Full error description:`)
            logger.debug(e)
            e['caught'] = true;
            throw e;
        }
        logger.error(`${symbols.error} Error encountered while parsing config file`)
        logger.debug(`${symbols.error} Full error description:`)
        logger.debug(e)
        e['caught'] = true;
        throw e;
    }
};

export const configurePlugins = (config: Config, cliOptions: BumpupPluginOptions): ConfiguredBumpupPlugin[] => {
    return config.plugins
        .filter(isPlugin)
        .map(plugin => {
            if (isPluginWithoutOptions(plugin)) {
                return plugin(cliOptions) as ConfiguredBumpupPlugin
            } else {
                const [pluginWithOptions, options] = plugin;
                return pluginWithOptions({...options, ...cliOptions}) as ConfiguredBumpupPlugin
            }
        });
}

export function isPlugin(plugin: BumpupPlugin | BumpupPluginWithOptions): boolean {
    return isPluginWithOptions(plugin) || isPluginWithoutOptions(plugin);
}

export function isPluginWithoutOptions(plugin: BumpupPlugin | BumpupPluginWithOptions): plugin is BumpupPlugin {
    return typeof plugin === 'function' && typeof plugin({}) === 'function';
}

export function isPluginWithOptions(plugin: BumpupPlugin | BumpupPluginWithOptions): plugin is BumpupPluginWithOptions {
    return plugin.length == 2 && plugin[0] as BumpupPlugin && typeof plugin[1] === 'object';
}

export const bump: (options: BumpOptions) => Promise<string> = async ({pre, dry, log, file,preid}) => {
    logger.level = log;
    let config;
    try {
        const configfile = findConfigFile(file);
        config = await parse(configfile);
        validateConfig(config);
    } catch (e) {
        return;
    }
    const cliOptions: BumpupPluginOptions = {
        dry,
        logLevel: log,
        pre: pre,
        preid: preid
    };
    const plugins = configurePlugins(config, cliOptions);

    bumpup(plugins);
    return 'returned';
}
