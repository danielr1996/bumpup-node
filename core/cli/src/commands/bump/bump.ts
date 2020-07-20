import {BumpupPluginWithOptions, getConfig} from "../../config/config";
import {bumpup, BumpupPlugin, BumpupPluginOptions, ConfiguredBumpupPlugin} from "@bumpup/lib";

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

type Options = {
    config: string,
    dry: boolean,
    log: LogLevel,
}

export const bump: (options: Options) => void = async (opts) => {

    const config = await getConfig();
    const cliOptions: BumpupPluginOptions = {
        dry: opts.dry,
        logLevel: opts.log,
    };

    const plugins: ConfiguredBumpupPlugin[] = config.plugins
        .filter(isPlugin)
        .map(plugin => {
            if (isPluginWithoutOptions(plugin)) {
                return plugin(cliOptions) as ConfiguredBumpupPlugin
            } else {
                const [pluginWithOptions, options] = plugin;
                return pluginWithOptions({...options, ...cliOptions}) as ConfiguredBumpupPlugin
            }
        });
    bumpup(plugins);
}

function isPlugin(plugin: BumpupPlugin | BumpupPluginWithOptions) {
    return isPluginWithOptions(plugin) || isPluginWithoutOptions(plugin);
}

function isPluginWithoutOptions(plugin: BumpupPlugin | BumpupPluginWithOptions): plugin is BumpupPlugin {
    return typeof plugin === 'function' && typeof plugin({}) === 'function';
}

function isPluginWithOptions(plugin: BumpupPlugin | BumpupPluginWithOptions): plugin is BumpupPluginWithOptions {
    return plugin.length == 2 && plugin[0] as BumpupPlugin && typeof plugin[1] === 'object';
}