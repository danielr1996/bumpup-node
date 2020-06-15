import {determine} from "./index";

describe('idempotent-release-determine-semver', ()=>{
    describe('determine', ()=>{
        it('determines patch versions correctly',()=>{
            expect(determine('patch')('1.5.10')).toBe("1.5.11");
        });
        it('determines minor versions correctly',()=>{
            expect(determine('minor')('1.5.10')).toBe("1.6.0");
        });
        it('determines major versions correctly',()=>{
            expect(determine('major')('1.5.10')).toBe("2.0.0");
        });
        it('determines none versions correctly',()=>{
            expect(determine('none')('1.5.10')).toBe(null);
        });
    })
})
