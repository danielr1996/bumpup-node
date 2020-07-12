import {bumpup, BumpupPlugin} from "./lib";
import 'jest-chain';

describe('@bumpup/lib', ()=>{
    describe('bumpup', ()=>{
        it('takes 1 plugin and executes it', ()=>{
            const plugin = jest.fn();

            bumpup([plugin]);

            expect(plugin).toBeCalledTimes(1);
        })
        it('takes 4 plugins and executes them', ()=>{
            const plugin1: BumpupPlugin = jest.fn(()=>({version: '1.0.0'}));
            const plugin2: BumpupPlugin = jest.fn(data=>({...data, type: 'minor'}));
            const plugin3: BumpupPlugin = jest.fn(data=>({...data, newVersion: '1.0.1'}));

            expect(bumpup([plugin1, plugin2, plugin3])).toEqual({version: '1.0.0', type: 'minor',newVersion: '1.0.1'});
            expect(plugin1).toBeCalledTimes(1);
            expect(plugin2).toBeCalledTimes(1).toBeCalledWith({version: '1.0.0'});
            expect(plugin3).toBeCalledTimes(1).toBeCalledWith({version: '1.0.0', type: 'minor'});
        })
    })
})