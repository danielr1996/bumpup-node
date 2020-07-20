import {bump, bumpWithEffects, FileSystem} from "./bump";

describe('@bumpup/determine-semver', () => {
    it('bumps the version', () => {
        const raw =
`{
  "version": "1.0.1",
  "name":"package"
}`
        const expected =
`{
  "version": "1.0.2",
  "name": "package"
}`
        const fs: FileSystem = {
            writeFileSync: jest.fn(),
            readFileSync: jest.fn(() => Buffer.from(raw)),
        }
        const bump = bumpWithEffects(fs, {logLevel: 'error'});
        const data = {newVersion: '1.0.2', version: '1.0.1'}
        expect(bump(data)).toBe(data);
        expect(fs.readFileSync).toBeCalled();
        expect(fs.writeFileSync).toBeCalledWith('package.json', expected);
    })
    it(`doesn't bump the version if the dry option is set`, () => {
        const raw =
`{
  "version": "1.0.1",
  "name":"package"
}`
        const fs: FileSystem = {
            writeFileSync: jest.fn(),
            readFileSync: jest.fn(() => Buffer.from(raw)),
        }
        const bump = bumpWithEffects(fs, {dry: true,logLevel: 'error'});
        const data = {newVersion: '1.0.2', version: '1.0.1'}
        expect(bump(data)).toBe(data);
        expect(fs.readFileSync).toBeCalled();
        expect(fs.writeFileSync).toBeCalledTimes(0);
    })
    it(`doesn't bump the version if there is no new version`, () => {
        const raw =
`{
  "version": "1.0.1",
  "name":"package"
}`
        const fs: FileSystem = {
            writeFileSync: jest.fn(),
            readFileSync: jest.fn(() => Buffer.from(raw)),
        }
        const bump = bumpWithEffects(fs, {logLevel: 'error'});
        const data = {newVersion: '1.0.1', version: '1.0.1'}
        expect(bump(data)).toBe(data);
        expect(fs.readFileSync).toBeCalledTimes(0);
        expect(fs.writeFileSync).toBeCalledTimes(0);
    })
    it('executes without errors', ()=>{
        bump({dry: true, logLevel: 'error'})({version: '1.0.0', newVersion: '1.0.0'})
    })
})