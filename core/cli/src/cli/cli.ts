import {bumpup, BumpupPlugin} from "@bumpup/lib";
import {getConfig, BumpupPluginWithOptions} from "../config/config";
import {BumpupPluginOptions, ConfiguredBumpupPlugin} from "@bumpup/lib/src/lib";

export const cli: () => void = async () => {
    const config = await getConfig();
    const cliOptions: BumpupPluginOptions = {
        dry: process.argv.join(' ').includes('--dry')
    };
    const plugins: ConfiguredBumpupPlugin[] = config.plugins
        .filter(isPlugin)
        .map(plugin => {
            if(isPluginWithoutOptions(plugin)){
              return plugin(cliOptions) as ConfiguredBumpupPlugin
            }else{
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