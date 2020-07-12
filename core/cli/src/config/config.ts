import {parse} from "./parse";
import {BumpupPlugin} from "@bumpup/lib";
import {BumpupPluginOptions} from "@bumpup/lib/src/lib";

export const CONFIG_FILE_NAME = 'bumpup.config.mjs';


export type BumpupPluginWithOptions = [BumpupPlugin, BumpupPluginOptions];

export type Config = {
    version: string,
    plugins: (BumpupPlugin|BumpupPluginWithOptions)[]
}

export const getConfig: () => Promise<Config> = async () => {
    return await parse(CONFIG_FILE_NAME);
}