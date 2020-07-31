import {determine} from "./determine";

describe('@bumpup/determine-semver', ()=>{
    describe('determine', ()=>{
        it('determines patch versions correctly',()=>{
            expect(determine({logLevel: 'info'})({type: 'patch', version: '1.5.10'})).toEqual({type: 'patch', version: '1.5.10', newVersion: '1.5.11'});
        });
        it('determines prepatch versions correctly',()=>{
            expect(determine({logLevel: 'info', pre: true})({type: 'patch', version: '1.5.10'})).toEqual({type: 'patch', version: '1.5.10', newVersion: '1.5.11-0'});
        });
        it('determines minor versions correctly',()=>{
            expect(determine({logLevel: 'info'})({type: 'minor', version: '1.5.10'})).toEqual({type: 'minor', version: '1.5.10', newVersion: '1.6.0'});
        });
        it('determines preminor versions correctly',()=>{
            expect(determine({logLevel: 'info', pre: true})({type: 'minor', version: '1.5.10'})).toEqual({type: 'minor', version: '1.5.10', newVersion: '1.6.0-0'});
        });
        it('determines major versions correctly',()=>{
            expect(determine({logLevel: 'info'})({type: 'major', version: '1.5.10'})).toEqual({type: 'major', version: '1.5.10', newVersion: '2.0.0'});
        });
        it('determines premajor versions correctly',()=>{
            expect(determine({logLevel: 'info', pre: true})({type: 'major', version: '1.5.10'})).toEqual({type: 'major', version: '1.5.10', newVersion: '2.0.0-0'});
        });
        it('determines none versions correctly',()=>{
            expect(determine({logLevel: 'info'})({type: 'none', version: '1.5.10'})).toEqual({type: 'none', version: '1.5.10',newVersion: '1.5.10'});
        });
        it('determines prenone versions correctly',()=>{
            expect(determine({logLevel: 'info', pre: true})({type: 'none', version: '1.5.10'})).toEqual({type: 'none', version: '1.5.10',newVersion: '1.5.10'});
        });
    })
})
