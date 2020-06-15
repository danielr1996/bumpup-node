import {SemVer} from "./semver";

export const inc = (version, release, options?, identifier?) => {
    if (typeof (options) === 'string') {
        identifier = options
        options = undefined
    }

    try {
        return new SemVer(version, options).inc(release, identifier).version
    } catch (er) {
        return null
    }
}