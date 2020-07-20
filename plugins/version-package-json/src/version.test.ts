import {extractVersion, log, parsePackageJson, readPackageJson, version} from "./version";

describe('@bumpup/version-package-json', () => {
    describe('parsePackageJson', () => {
        it('parses package.json', () => {
            const rawPackagejson = `{"version":"2.0.0"}`
            const parsedPackageJson = {
                version: "2.0.0"
            }
            expect(parsePackageJson(rawPackagejson)).toEqual(parsedPackageJson);

        })
    })
    describe('extractVersion', () => {
        it('extractsTheVersion', () => {
            const parsedPackageJson = {
                version: "2.0.0"
            }
            expect(extractVersion(parsedPackageJson)).toEqual({version: "2.0.0"});

        })
    })

    it('dummyTests', ()=>{
        readPackageJson();
        log('info')({});
        version({logLevel: 'error'});
    })
})