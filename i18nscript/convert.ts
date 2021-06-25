import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const dist = './client/locales/zh-CN.json';

async function main(){
    const str = await readFile(dist, 'utf8');
    let obj = {};
    try {
        obj = JSON.parse(str);
    } catch (error) {
        console.error(error);
    }
    
    const eles = Object.keys(obj).map(k=>`${obj[k].replace(/\n/g,'')}`).join('\n');
    await writeFile('./value.txt', eles);
}

main().then(()=>console.log('done'));