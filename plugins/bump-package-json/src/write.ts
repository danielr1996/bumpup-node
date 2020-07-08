import {FileSystem} from "./bump";

export const writeFileWithFs = (filesystem: FileSystem) => (data: string): void => filesystem.writeFileSync('package.json', data);
