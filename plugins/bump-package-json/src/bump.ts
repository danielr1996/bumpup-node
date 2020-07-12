import {BumpupData} from "@bumpup/lib";
import * as fs from "fs";
import {PathLike} from "fs";
import {writeFileWithFs} from "./write";
import {readFileWithFs} from "./read";
import {emoji, trace} from "@bumpup/fp";

export type FileSystem = {
    writeFileSync: (path: PathLike, data: string) => void,
    readFileSync: (path: PathLike | number, options?: { encoding?: string; flag?: string; } | null) => string | Buffer,
}

export const parse: (string) => ({ version: string }) = JSON.parse;

export const stringify: ({version: string}) => string = pkg => JSON.stringify(pkg, null, 2);

export const replace = (version: string) => (pkg: { version: string }): { version: string } => ({...pkg, version});

export const bumpWithEffects = (fs: FileSystem, options: { dry?: boolean }) => (data: BumpupData): BumpupData => {
    if (data.version !== data.newVersion) {
        const read = readFileWithFs(fs)();
        const parsed = parse(read);
        const replaceWithVersion = replace(data.newVersion);
        const replaced = replaceWithVersion(parsed)
        const stringified = stringify(replaced);
        if(!options.dry){
            writeFileWithFs(fs)(stringified);
        }else{
            console.log('Not Bumping because the \'dry\' option was specified')
        }
    }
    console.log(`${emoji`👊`} ${data.newVersion !== data.version ? `` : `not `}bumping version in package.json`)
    return data;
}

export const bump: (options: { dry?: boolean }) => (BumpupData) => BumpupData = options => bumpWithEffects(fs, options);
