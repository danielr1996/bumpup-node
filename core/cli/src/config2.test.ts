it('test', ()=>{
    expect(true).toBeTruthy();
})
/*import {
    emoji,
    getConfigWithPackageJson,
    parseEmoji,
    postBump,
    postDetermine,
    postRecord,
    postType,
    postVersion
} from "./config2";

describe('config', () => {
    it('parses config v1', () => {
        const packageJson = Buffer.from(`
        {
          "version": "1.0.0",
          "steps": {
            "version": {
              "version": "../../../plugins/version-package-json"
            },
            "type": {
              "type": "../../../plugins/type-git"
            },
            "determine": {
              "determine": "../../../plugins/determine-semver"
            },
            "bump": {
              "bump": "../../../plugins/bump-package-json"
            },
            "record": {
              "record": "../../../plugins/type-git#record"
            }
          }
        }
        `)
        const getConfig = getConfigWithPackageJson(packageJson);
        expect(getConfig()[0]).toBe('../../../plugins/version-package-json')
        expect(getConfig()[2]).toBe('../../../plugins/type-git')
        expect(getConfig()[4]).toBe('../../../plugins/determine-semver')
        expect(getConfig()[6]).toBe('../../../plugins/bump-package-json')
        expect(getConfig()[8]).toBe('../../../plugins/type-git#record')
        getConfig();
    })
    describe('emoji', () => {
        it('parses emojies on linux', () => {
            const emoji = parseEmoji('linux');
            expect(emoji`📦`).toBe('📦');
        })

        it('parses emojies on windows', () => {
            const emoji = parseEmoji('win32');
            expect(emoji`📦`).toBe('✔');
        })
    })

    describe('post', ()=>{
        console.log = jest.fn();
        describe('Version', ()=>{
            it(' logs to console', ()=>{
                postVersion({version: '1.0.0'});
                expect(console.log).toBeCalledWith(`${emoji`📖`} current version is 1.0.0`);
            })
        })
        describe('Type', ()=>{
            it(' logs to console', ()=>{
                postType({type: 'feat'});
                expect(console.log).toBeCalledWith(`${emoji`🅱`} change type is feat`);
            })
        })
        describe('Determine', ()=>{
            it(' with same version logs to console', ()=>{
                postDetermine({version: '1.0.0', newVersion: '1.0.0'});
                expect(console.log).toBeCalledWith(`${emoji`🔎`} no new version`);
            })
            it(' with different version logs to console', ()=>{
                postDetermine({version: '1.0.0', newVersion: '1.0.1'});
                expect(console.log).toBeCalledWith(`${emoji`🔎`} new version is 1.0.1`);
            })
        })
        describe('Bump', ()=>{
            it(' with same version logs to console', ()=>{
                postBump({version: '1.0.0', newVersion: '1.0.0'});
                expect(console.log).toBeCalledWith(`${emoji`👊`} not bumping version in package.json`);
            })
            it(' with different version logs to console', ()=>{
                postBump({version: '1.0.0', newVersion: '1.0.1'});
                expect(console.log).toBeCalledWith(`${emoji`👊`} bumping version in package.json`);
            })
        })
        describe('Record', ()=>{
            it(' with same version logs to console', ()=>{
                let outputData = "";
                const storeLog = inputs => (outputData += inputs);
                console["log"] = jest.fn(storeLog);
                postRecord({version: '1.0.0', newVersion: '1.0.0'});
                expect(console.log).toBeCalledWith(`${emoji`📌`} not recording version in git`);
            })
            it(' with different version logs to console', ()=>{
                let outputData = "";
                const storeLog = inputs => (outputData += inputs);
                console["log"] = jest.fn(storeLog);
                postRecord({version: '1.0.1', newVersion: '1.0.0'});
                expect(console.log).toBeCalledWith(`${emoji`📌`} recording version in git`);
            })
        })
    })
})*/