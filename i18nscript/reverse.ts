import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const dist = './client/locales/zh-CN.json';

async function main(){
    const str = await readFile(dist, 'utf8');
    const tran = await readFile('./trans.txt', 'utf8');
    const value = tran.split('\n');
    let obj = {};
    try {
        obj = JSON.parse(str);
    } catch (error) {
        console.error(error);
    }
    const newObj = {}
    Object.keys(obj).forEach((k, idx)=>{
        newObj[k] = value[idx];
    });
    await writeFile('./client/locales/en-US.json', JSON.stringify(newObj, null, 2));
}

main().then(()=>console.log('done'));