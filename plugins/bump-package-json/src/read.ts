import {FileSystem} from "./bump";

export const readFileWithFs = (filesystem: FileSystem) => (): string | Buffer => filesystem.readFileSync('package.json', {
    encoding: 'utf8',
    flag: 'r'
});
