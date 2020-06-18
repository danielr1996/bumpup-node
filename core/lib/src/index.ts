import {match} from "@bumpup/fp";

export type VersionReader = () => string;
export type TypeReader = (string) => string;
export type VersionDeterminer = (string) => (string) => string;
export type VersionBumper = (string) => { status: string, message: string };
export type VersionRecorder = (string) => { status: string, message: string }
export type Releaser = () => void;

export const parseEmoji = platform => emoji => platform === "win32" ? '✔' : emoji[0];
export const emoji = parseEmoji(process.platform);

export const release =
    (vReader: VersionReader) =>
        (tReader: TypeReader) =>
            (determiner: VersionDeterminer) =>
                (bumper: VersionBumper) => (recorder: VersionRecorder): Releaser => {
                    return () => {
                        const lastVersion = vReader();
                        console.log(`${emoji`📖`} current version is ${lastVersion}`)
                        const type = tReader(lastVersion);
                        console.log(`${emoji`🅱`} change type is ${type}`)
                        const newVersion = determiner(type)(lastVersion);
                        console.log(`${emoji(`🔎`)} ${newVersion !== null ? `new version is ${newVersion}`: `no new version`}`)
                        bumper(newVersion)
                        console.log(`${emoji(`👊`)} bumping version in package.json`)
                        recorder(newVersion)
                        console.log(`${emoji(`📌`)} recording version in git`)
                        console.log(`${emoji(`📦`)} done`)
                    };
                }

