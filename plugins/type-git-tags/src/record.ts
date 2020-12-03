import * as child_process from "child_process";
import winston from 'winston';
import symbols from 'log-symbols';
import fs from "fs";

const record = options => data => {
    // Create Logger
    const logger = winston.createLogger({
        level: options.logLevel,
        format: winston.format.printf(({message}) => message),
        transports: [new winston.transports.Console()]
    })

    if (!fs.existsSync('.git')) {
        logger.error(`${symbols.error} .git directory doesn't exist`);
        return data;
    }

    // Check if at least one commit exists
    try{
        child_process.execSync(`git log`, {stdio: 'pipe'}).toString();
    }catch (e){
        logger.error(`${symbols.error} branch does not have any commits yet`);
        return data;
    }

    // Create tag
    if(data.type === 'new'){
        console.log(child_process.execSync(`git tag -a ${data.version} -m ${data.version}`).toString())
        return data;
    }

    if (data.newVersion !== data.version) {
        if(!options.dry){
            child_process.execSync(`git tag -a ${data.newVersion} -m ${data.newVersion}`)
        }else{
            logger.warn(`${symbols.warning} Not Recording because the 'dry' option was specified`)
        }
    }else{
        logger.info(`${symbols.info} not recording version in git`)
    }
    return data;
};

export default record;
