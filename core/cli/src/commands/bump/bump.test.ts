import {
    bump,
    BumpupPluginWithOptions, Config, configurePlugins,
    findConfigFile,
    formatter,
    isPlugin,
    isPluginWithOptions,
    isPluginWithoutOptions, parse, validateConfig
} from "./bump";
import {BumpupPlugin} from "@bumpup/lib/src";
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as tempy from 'tempy';


describe('@bumpup/cli', () => {
    describe('bump', () => {
        describe('findConfigFile', () => {
            it('finds the a .mjs config file', () => {
                const cwd = process.cwd();
                process.chdir(os.tmpdir())
                const expected = `file://${os.tmpdir()}${path.sep}bumpup.config.mjs`;
                const actual = findConfigFile('bumpup.config.mjs');
                expect(actual).toBe(expected);
                process.chdir(cwd);
            })
            it('finds the a .js config file', () => {
                const cwd = process.cwd();
                process.chdir(os.tmpdir())
                const expected = `${os.tmpdir()}${path.sep}bumpup.config.js`;
                const actual = findConfigFile('bumpup.config.js');
                expect(actual).toBe(expected);
                process.chdir(cwd);
            })
        })

        describe('parseConfig', () => {
            it('parses config', async () => {
                const configFileName = tempy.file({extension: 'js'});
                fs.writeFileSync(configFileName, 'export default "test"', 'utf-8');
                const module = await parse(configFileName);
                expect(module).toBe("test");
            })

            it('throws an error for a not found module', () => {
                const filename = path.resolve(os.tmpdir(), 'nonsense.js');
                expect(parse(filename)).rejects.toBeTruthy();
            })

            it('throws an error for a a invalid module', () => {
                const filename = path.resolve(os.tmpdir(), 'bumpup.config2.js');
                fs.writeFileSync(filename, 'nonsense', 'utf-8');
                expect(parse(filename)).rejects.toBeTruthy();
            })
        })

        describe('validateConfig', () => {
            it('accepts version 2.0.0', () => {
                const config: Config = {
                    version: '2.0.0',
                    plugins: []
                }
                expect(validateConfig(config)).toBeUndefined();
            })
            it('recjets version 3.0.0', () => {
                const config: Config = {
                    version: '3.0.0',
                    plugins: []
                }
                expect(()=>validateConfig(config)).toThrow();
            })
        })

        describe('configurePlugins', () => {
            it('configures plugins', () => {
                const options = {opacity: 0.4};
                const config: Config = {
                    version: '2.0.0',
                    plugins: [
                        options => () => options,
                        [options => () => options, {color: 'blue'}]
                    ]

                }

                expect(configurePlugins(config, options)[0]({})).toEqual({opacity: 0.4});
                expect(configurePlugins(config, options)[1]({})).toEqual({opacity: 0.4, color: 'blue'});
            })
        })

        describe('isPlugin', () => {
            const pluginWithOptions: BumpupPluginWithOptions = [() => data => data, {color: 'blue'}]
            const pluginWithoutOptions: BumpupPlugin = () => data => data

            describe('', () => {
                it('recognizes BumpupPluginWithOptions', () => {
                    expect(isPlugin(pluginWithOptions)).toBeTruthy();
                })
                it('recjects BumpupPlugin', () => {
                    expect(isPlugin(pluginWithoutOptions)).toBeTruthy();
                })
            })

            describe('WithOptions', () => {
                it('recognizes BumpupPluginWithOptions', () => {
                    expect(isPluginWithOptions(pluginWithOptions)).toBeTruthy();
                })
                it('recjects BumpupPlugin', () => {
                    expect(isPluginWithOptions(pluginWithoutOptions)).toBeFalsy();
                })
            })
            describe('WithoutOptions', () => {
                it('recognizes BumpupPlugin', () => {
                    expect(isPluginWithoutOptions(pluginWithoutOptions)).toBeTruthy();
                })
                it('recjects BumpupPluginWithOptions', () => {
                    expect(isPluginWithoutOptions(pluginWithOptions)).toBeFalsy();
                })
            })
        })

        describe('bump', ()=>{
            it('executes without errors', ()=>{
                const configFileName = tempy.file({extension: 'js'});
                fs.writeFileSync(configFileName,'export default {version: "2.0.0", plugins: [()=>data=>data]}','utf-8')
                expect(bump({log: 'debug', file: configFileName, dry: true})).resolves.toBe('returned');
            })
            it('terminates for invalid config', async ()=>{
                const configFileName = tempy.file({extension: 'js'});
                fs.writeFileSync(configFileName,'export default {version: "3.0.0", plugins: [()=>data=>data]}','utf-8')
                expect(await bump({log: 'debug', file: configFileName, dry: true})).toBeUndefined();
            })
        })
    })

    /**
     * Should be moved to another module if the logger is reused
     */
    describe('moveToAnotherModule', () => {
        describe('formatter', () => {
            expect(formatter({message: 'message'})).toBe('message')
        })
    })
})