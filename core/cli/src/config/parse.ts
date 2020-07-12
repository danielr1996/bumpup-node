import path from 'path';
import {Config} from "./config";

export const parse: (filename: string)=>Promise<Config> = async filename => {
    const configfile = `file://${path.resolve(process.cwd(), filename)}`;
    try{
        const config = (await import(configfile)).default;
        if(config.version === '2.0.0'){
            return config as Config;
        }else{
            console.error('Config versions other than 2.0.0 are not yet supported');
        }
    }catch(e){
        console.error(`[${e || e}] Could not parse ${configfile}`)
        process.exit(-1);
    }
};