import {flow} from "@bumpup/fp";

export type BumpupData = {
    version?: string,
    type?: string,
    newVersion?: string
}

export type BumpupPluginOptions = Record<string, unknown>;
export type ConfiguredBumpupPlugin = (data: BumpupData) => BumpupData;
export type BumpupPlugin = (options: BumpupPluginOptions) => ConfiguredBumpupPlugin;

export const bumpup: (plugins: ConfiguredBumpupPlugin[])=> BumpupData = (plugins) => flow(...plugins)();