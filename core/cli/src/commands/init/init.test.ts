import * as path from "path";
import * as os from 'os';
import * as fs from 'fs';
import {defaultConfig, init} from "./init";

describe('@bumpup/cli', ()=>{
   describe('init', ()=>{
       it('writes a default configuration to the specified file', async ()=>{
           const options = {
               file: path.resolve(os.tmpdir(),'bumpup.init.js')
           }

           await init(options);
           expect(fs.readFileSync(options.file,'utf-8')).toBe(defaultConfig);

       })
       it('true', ()=>{
           expect(true).toBeTruthy();
       })
   })
});