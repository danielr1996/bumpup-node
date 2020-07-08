import {bumpWithEffects, FileSystem} from "./bump";

describe('@bumpup/determine-semver', () => {
    it('bumpWithFs', () => {
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
        const bump = bumpWithEffects(fs);
        const data = {newVersion: '1.0.2', version: '1.0.1'}
        expect(bump(data)).toBe(data);
        expect(fs.readFileSync).toBeCalled();
        expect(fs.writeFileSync).toBeCalledWith('package.json', expected);
    })
})