import {pipe, prop} from "ramda";
import {BumpupData} from "../../../core/lib/src";

const lift2 = f => g => h => x => f(g(x))(h(x));
export const applyFnToObj = (fn, key) => obj => ({...obj, [key]: fn(obj)})

const split = version => version.split('.').map(x => parseInt(x))

const increase = type => version => {
    if (type === 'patch') {
        version[2]++;
    }
    if (type === 'minor') {
        version[2] = 0;
        version[1]++;
    }
    if (type === 'major') {
        version[2] = 0;
        version[1] = 0;
        version[0]++;
    }
    return version;
}

export const join = (version: string[]): string => version.map(x => x.toString()).join('.');

export const determine = lift2((type: string): (string) => string => pipe(split, increase(type), join))(prop('type'))(prop('version'));
export const step: (BumpupData) => BumpupData = applyFnToObj(determine, 'newVersion')
