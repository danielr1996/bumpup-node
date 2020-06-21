import {
    bumpupWithConfig,
    BumpupConfig,
    Step, loadSubModuleWithModuleLoader, loadModule, loadModules, BumpupData,
} from './index';
import 'jest-chain';
import * as fs from 'fs';
import * as path from 'path';
import {FunctionalInterface} from "@bumpup/fp";

describe('@bumpup/lib', () => {
    const version: Step = jest.fn(() => ({version: '1.0.0'}));
    const type: Step = jest.fn(data => ({...data, type: 'fix'}));
    const determine: Step = jest.fn(data => ({...data, newVersion: '1.0.1'}));
    const bump: Step = jest.fn(data => data);
    const record: Step = jest.fn(data => data);
    const bumpupConfig: BumpupConfig = [
        version,
        type,
        determine,
        bump,
        record,
    ];

    it('should parse the submodule with explicit name', async () => {
        const modulename = '@bumpup/type#record';
        const loadModule = async () => Promise.resolve({"type": 'type', "record": 'record'});
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const loadSubModule = loadSubModuleWithModuleLoader(loadModule);

        expect(await loadSubModule(modulename)).toEqual('record')
    })

    it('should parse the submodule with default name', async () => {
        const modulename = '@bumpup/type';
        const loadModule = async () => Promise.resolve({step: 'type', record: 'record'});
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const loadSubModule = loadSubModuleWithModuleLoader(loadModule);

        expect(await loadSubModule(modulename)).toEqual('type')
    })

    it('should call each step exactly once', () => {
        const result = bumpupWithConfig(bumpupConfig);
        expect(result).toEqual({version: '1.0.0', type: 'fix', newVersion: '1.0.1'})
        expect(version).toHaveBeenCalledTimes(1);
        expect(type).toHaveBeenCalledWith({version: '1.0.0'}).toHaveBeenCalledTimes(1);
        expect(determine).toHaveBeenCalledWith({version: '1.0.0', type: 'fix'}).toHaveBeenCalledTimes(1);
        expect(bump).toHaveBeenCalledWith({version: '1.0.0', type: 'fix', newVersion: '1.0.1'}).toHaveBeenCalledTimes(1)
        expect(record).toHaveBeenCalledWith({
            version: '1.0.0',
            type: 'fix',
            newVersion: '1.0.1'
        }).toHaveBeenCalledTimes(1)
    })
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('loadModule', () => {
        it('loads the module', async () => {
            const file = path.resolve('node_modules', 'module.js');
            fs.writeFileSync(file, `module.exports.a = '1';`)
            expect(await loadModule('module')).toEqual({a: '1'});
            fs.unlinkSync(file);
            expect(fs.existsSync(file)).toBeFalsy();
        })
        it('loads the modules', async () => {
            const step = data=>data;
            const loader: (modulename: string) => Promise<FunctionalInterface<BumpupData, BumpupData>> = () => Promise.resolve(step);
            const moduleConfig = [step,'step']
            const expected = [step, step];
            const actual = await loadModules(loader)(moduleConfig);
            expect(actual).toEqual(expected);
        })
    })
})