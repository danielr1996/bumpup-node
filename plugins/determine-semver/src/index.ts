import {flow} from "@bumpup/fp";
import {BumpupData} from "../../../core/lib/src";


const split = data => ({...data, newVersion: data.version.split('.').map(x => parseInt(x))})

const increase = data => {
    if(data.type === 'patch'){
        data.newVersion[2]++;
    }
    if(data.type === 'minor'){
        data.newVersion[2]=0;
        data.newVersion[1]++;
    }
    if(data.type === 'major'){
        data.newVersion[2]=0;
        data.newVersion[1]=0;
        data.newVersion[0]++;
    }
    return data;
}

export const join = (data: { newVersion: string[] }): BumpupData => ({...data, newVersion: data.newVersion.map(x => x.toString()).join('.')});

export const step = flow(split,increase,join);