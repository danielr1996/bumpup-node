import {readFileWithFs} from "./read";
import {FileSystem} from "./bump";

describe('@bumpup/determine-semver', () => {
    const fs: FileSystem = {
        readFileSync: jest.fn(() => 'data'),
        writeFileSync: jest.fn(),
    }
    it('readPackageJsonWithFs', () => {
        const readFile = readFileWithFs(fs);
        expect(readFile()).toBe('data');
        expect(fs.readFileSync).toHaveBeenCalledWith('package.json', {encoding: 'utf8', flag: 'r'});
    })
})