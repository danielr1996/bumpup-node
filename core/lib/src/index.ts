import {match} from "@bumpup/fp";

export type VersionReader = () => string;
export type TypeReader = (string) => string;
export type VersionDeterminer = (string) => (string) => string;
export type VersionBumper = (string) => { status: string, message: string };
export type VersionRecorder = (string) => { status: string, message: string }
export type Releaser = () => void;

const emoji = {
    emojify: name =>
        match([
            {test: name === ':book:', value: '📖'},
            {test: name === ':punch:', value: '👊'},
            {test: name === ':pushpin:', value: '📌'},
            {test: name === ':mag_right:', value: '🔎'},
            {test: name === ':b:', value: '🅱️'},
            {test: true, value: '📦'},
        ])

}

export const release =
    (vReader: VersionReader) =>
        (tReader: TypeReader) =>
            (determiner: VersionDeterminer) =>
                (bumper: VersionBumper) => (recorder: VersionRecorder): Releaser => {
                    return () => {
                        const lastVersion = vReader();
                        console.log(emoji.emojify(`:book:`) + (` current version is ${lastVersion}`))
                        const type = tReader(lastVersion);
                        console.log(emoji.emojify(`:b:`) + (` change type is ${type}`))
                        const newVersion = determiner(type)(lastVersion);
                        console.log(newVersion !== null ? emoji.emojify(`:mag_right:`) + (` new version is ${newVersion}`) : emoji.emojify(`:mag_right:`) + (` no new version`))
                        bumper(newVersion).message
                        console.log(newVersion !== null ? emoji.emojify(`:punch:`) + (` bumping ${newVersion}`) : emoji.emojify(`:punch:`) + (` Nothing changed. Not bumping`))
                        recorder(newVersion).message
                        console.log(newVersion !== null ? emoji.emojify(`:pushpin:`) + (` recording ${newVersion}`) : emoji.emojify(`:pushpin:`) + (` Nothing changed. Not recording`))
                        console.log(emoji.emojify('') + (' done'))
                    };
                }

