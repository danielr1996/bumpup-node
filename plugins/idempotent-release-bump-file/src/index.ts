import * as fs from "fs";

export const bump = newVersion=>{
    if(newVersion!==null){
        console.log('Bumping version ',newVersion);
        fs.writeFileSync('version.txt',newVersion);
    }else{
        console.log('Nothing changed. Not bumping');
    }
};