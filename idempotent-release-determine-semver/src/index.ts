import * as semver from "semver";

export const determine = changeType => lastVersion => {
    if(changeType === 'none'){
        return null;
    }
    return semver.inc(lastVersion, changeType)
}