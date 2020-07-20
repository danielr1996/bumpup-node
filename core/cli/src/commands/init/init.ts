import fs from 'fs';
import path from 'path';

export const defaultConfig =
    `import version from '@bumpup/version-package-json';
import {type, record} from '@bumpup/type-git';
import bump from '@bumpup/bump-package-json';
import determine from '@bumpup/determine-semver';

export default {
    version: "2.0.0",
    plugins: [
        version,
        type,
        determine,
        bump,
        record,
    ]
}`

type InitOptions = {
    file: string
}

export const init: (options: InitOptions) => void = async ({file}) => {
    return await fs.promises.writeFile(path.resolve(process.cwd(), file), defaultConfig, 'utf-8');
}