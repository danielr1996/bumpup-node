import fs from 'fs';
import path from 'path';

const defaultConfig =
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

type Options = {
    config: string
}

export const init: (options: Options) => void = async ({config}) => {
    return await fs.promises.writeFile(path.resolve(process.cwd(), config), defaultConfig, 'utf-8');
}