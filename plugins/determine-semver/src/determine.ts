import {pipe, prop} from "ramda";
import {BumpupData} from "@bumpup/lib";
import {BumpupPlugin} from "@bumpup/lib/src";
import {emoji, trace} from "@bumpup/fp";

const lift2 = f => g => h => x => f(g(x))(h(x));
export const applyFnToObj = (fn: (obj: Record<string, unknown>) => unknown, key: string) => (obj: Record<string, unknown>): Record<string, unknown> => ({
    ...obj,
    [key]: fn(obj)
})

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

export const determine = lift2((type: string): (string) => string => pipe(split, increase(type), join),)(prop('type'))(prop('version'));
export const step: BumpupPlugin = () => pipe(applyFnToObj(determine, 'newVersion'),trace((data: BumpupData) => console.log(`${emoji`🔎`} ${data.newVersion !== data.version ? `new version is ${data.newVersion}` : `no new version`}`)))
