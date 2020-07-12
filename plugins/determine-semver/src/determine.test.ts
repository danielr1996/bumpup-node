import {step} from "./determine";

describe('@bumpup/determine-semver', ()=>{
    describe('determine', ()=>{
        it('determines patch versions correctly',()=>{
            expect(step({})({type: 'patch', version: '1.5.10'})).toEqual({type: 'patch', version: '1.5.10', newVersion: '1.5.11'});
        });
        it('determines minor versions correctly',()=>{
            expect(step({})({type: 'minor', version: '1.5.10'})).toEqual({type: 'minor', version: '1.5.10', newVersion: '1.6.0'});
        });
        it('determines major versions correctly',()=>{
            expect(step({})({type: 'major', version: '1.5.10'})).toEqual({type: 'major', version: '1.5.10', newVersion: '2.0.0'});
        });
        it('determines none versions correctly',()=>{
            expect(step({})({type: 'none', version: '1.5.10'})).toEqual({type: 'none', version: '1.5.10',newVersion: '1.5.10'});
        });
    })
})
