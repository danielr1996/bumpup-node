import version from './plugins/version-package-json/dist/index.js';
import {record,type} from './plugins/type-git/dist/index.js';
import bump from './plugins/bump-package-json/dist/index.js';
import determine from './plugins/determine-semver/dist/index.js';

export default {
    version: "2.0.0",
    plugins: [
        version,
        type,
        determine,
        bump,
        record,
    ]
}
