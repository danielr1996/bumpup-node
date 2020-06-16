export type VersionReader = () => string;
export type TypeReader = (string) => string;
export type VersionDeterminer = (string) => (string) => string;
export type VersionBumper = (string) => { status: string, message: string };
export type VersionRecorder = (string) => { status: string, message: string }
export type Releaser = () => void;

export const release =
    (vReader: VersionReader) =>
        (tReader: TypeReader) =>
            (determiner: VersionDeterminer) =>
                (bumper: VersionBumper) => (recorder: VersionRecorder): Releaser => {
                    return () => {
                        const lastVersion = vReader();
                        console.log(`version: current version is ${lastVersion}`)
                        const type = tReader(lastVersion);
                        console.log(`type: change type is ${type}`)
                        const newVersion = determiner(type)(lastVersion);
                        console.log(newVersion !== null ? `determine: new version is ${newVersion}`: `determine: no new version`)
                        console.log(bumper(newVersion).message);
                        console.log(recorder(newVersion).message);
                    };
                }

