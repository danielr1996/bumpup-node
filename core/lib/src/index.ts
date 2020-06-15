export type VersionReader = () => string;
export type TypeReader = (string) => string;
export type VersionDeterminer = (string) => (string) => string;
export type VersionBumper = (string) => void;
export type VersionRecorder = (string) => void
export type Releaser = () => void;

export const release =
    (vReader: VersionReader) =>
        (tReader: TypeReader) =>
            (determiner: VersionDeterminer) =>
                (bumper: VersionBumper) => (recorder: VersionRecorder): Releaser => {
                    return () => {
                        const lastVersion = vReader();
                        console.log(`bumpup: current version is ${lastVersion}`)
                        const type = tReader(lastVersion);
                        console.log(`bumpup: change type is ${type}`)
                        const newVersion = determiner(type)(lastVersion);
                        console.log(newVersion !== null ? `bumpup: new version is ${newVersion}`: `bumpup: no new version`)
                        bumper(newVersion);
                        recorder(newVersion);
                    };
                }

