// @ts-ignore
import {log, flow} from "idempotent-release-fp/dist/index.cjs";

export type VersionReader = () => string;
export type TypeReader = (string) => string;
export type VersionDeterminer = (string) => (string) => string;
export type VersionBumper = (string) => void;
export type Releaser = () => void;

export const release = (vReader: VersionReader) => (tReader: TypeReader) => (determiner: VersionDeterminer) => (bumper: VersionBumper): Releaser => {
    return ()=>{
        const lastVersion = vReader();
        const type = tReader(lastVersion);
        const newVersion = determiner(type)(lastVersion);
        bumper(newVersion);
    };
}

