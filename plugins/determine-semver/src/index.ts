import {flow} from "@bumpup/fp";

export const determine = changeType => flow(split, increase(changeType), join)

const split = (lastVersion: string): number[] => lastVersion.split('.').map(x => parseInt(x))

const increase = changeType=>(newVersion: number[]): number[] => {
    if(changeType === 'patch'){
        newVersion[2]++;
    }
    if(changeType === 'minor'){
        newVersion[2]=0;
        newVersion[1]++;
    }
    if(changeType === 'major'){
        newVersion[2]=0;
        newVersion[1]=0;
        newVersion[0]++;
    }
    if(changeType === 'none'){
        return null;
    }
    return newVersion;
}

const join = (newVersion: number[]) => newVersion !== null ? newVersion.map(x => x.toString()).join('.'): null;