import {lift, debug} from "idempotent-release-fp";
import {flow} from "idempotent-release-fp";

export const configure = (getLastVersion, getChangeType, getNewVersion, bump) => {
    const getNewVersionFromChangeTypeAndLastVersion = lift(getNewVersion)(flow(getChangeType))(flow(getLastVersion));
    return flow(getNewVersionFromChangeTypeAndLastVersion, bump);
}


