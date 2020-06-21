import {trace} from "@bumpup/fp";
import {BumpupData, ModuleConfig} from "@bumpup/lib";

export const parseEmoji = (platform: string) => (emoji: TemplateStringsArray): string => platform === "win32" ? '✔' : emoji[0];
export const emoji = parseEmoji(process.platform);

export type ConfigFile = {
    version: string,
    steps: {
        version: { version: string },
        type: { type: string },
        determine: { determine: string }
        bump: { bump: string },
        record: { record: string },
    }
}


const parseJson = (json): ConfigFile => JSON.parse(json);

const extractVersion = (config: ConfigFile) => config.steps.version.version;
const extractType = (config: ConfigFile) => config.steps.type.type;
const extractDetermine = (config: ConfigFile) => config.steps.determine.determine;
const extractBump = (config: ConfigFile) => config.steps.bump.bump;
const extractRecord = (config: ConfigFile) => config.steps.record.record;

export const postVersion = trace((data: BumpupData) => console.log(`${emoji`📖`} current version is ${data.version}`))
export const postType = trace((data: BumpupData) => console.log(`${emoji`🅱`} change type is ${data.type}`))
export const postDetermine = trace((data: BumpupData) => console.log(`${emoji`🔎`} ${data.newVersion !== data.version ? `new version is ${data.newVersion}` : `no new version`}`))
export const postBump = trace((data: BumpupData) => console.log(`${emoji`👊`} ${data.newVersion !== data.version ? `` : `not `}bumping version in package.json`))
export const postRecord = trace((data: BumpupData) => console.log(`${emoji`📌`} ${data.newVersion !== data.version ? `` : `not `}recording version in git`))

export function getConfigWithPackageJson(packageJson: Buffer) {
    return function (): ModuleConfig {
        const json: ConfigFile = parseJson(packageJson);
        return [
            extractVersion(json),
            postVersion,
            extractType(json),
            postType,
            extractDetermine(json),
            postDetermine,
            extractBump(json),
            postBump,
            extractRecord(json),
            postRecord,
        ];
    }

}
