import * as semver from "semver";

export const determine = changeType => lastVersion => semver.inc(lastVersion, changeType)