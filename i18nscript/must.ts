import { ts, Project, Writers } from "ts-morph";
import { SyntaxKind } from 'typescript';
import * as glob from "glob";
import * as fs from 'fs';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

function genPrefix(filename) {
    let prefix = filename.replace(/\.(js|jsx)/, '').replace(/\./g, '').split('/');
    // remove empty element
    prefix = prefix.filter(r=>!!r);

    if (prefix.length > 2) {
        prefix = prefix.slice(prefix.length - 2, prefix.length);
    } 
    return prefix.join('.') + '.';
}

function genID(prefix, text) {
    const t = text.slice(0, 10).trim().replace(/\"/g, '').replace(/\'/g, '').replace(/\`/g, '');
    return prefix + t;
}

function isChinese(text) {
    const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
    return REGEX_CHINESE.test(text);
}

function escapeQuota(text) {
    return text.replace(/\"/g, '\"').replace(/\'/g, '\'').replace(/\`/g, '\`');
}


// to store key-value

async function output(mp){
    const dist = './client/locales/zh-CN.json';
    console.log(mp);
    let obj = {};

    try {
        const jsonStr = await readFile(dist, 'utf8');
        obj = JSON.parse(jsonStr);    
    } catch (error) {
        console.error(error)
    }

    try {
        await writeFile(dist, JSON.stringify({ ...obj, ...mp }, null, 2))
    } catch (error) {
        console.error(error)
    }
}

async function main() {
    const mp = {};
    const ignore = [
        
    ];
    // vendors/client/components/Postman/Postman.js
    // options is optional
    // glob("./client/components/Postman/Postman.js", function (er, files) {
    glob("./client/containers/**/*.js", function (er, files) {

        const project = new Project();

        files.filter(filename=>{
            const some = ignore.some(i=>filename.include(i));
            return !some;
        }).forEach(filename => {
            const sourceFile = project.addSourceFileAtPath(filename);

            const idprefix = genPrefix(filename);

            // only the file that need to be transformed should import react-intl-universal module
            let needImport = false;

            sourceFile.transform(traversal => {
                const node = traversal.visitChildren(); // return type is `ts.Node`

                // transform jsxText || StringLiteral

                if (ts.isJsxText(node) || ts.isStringLiteral(node)) {
                    let text = node.text;

                    // dont convert 
                    if (ts.isCallExpression(node.parent)){
                        if(node.parent.expression.getText() === 'intl.get'){
                            return node;
                        }
                    }

                    if (text && isChinese(text)) {
                        needImport = true;
                        text = text.trim();
                        const id = genID(idprefix, text);
                        mp[id] = escapeQuota(text);

                        if (ts.isJsxText(node)) {
                            return ts.updateJsxText(node, `{intl.get('${id}')}`);
                        }

                        if (ts.isJsxAttribute(node.parent)){
                            return ts.createJsxText(`{intl.get('${id}')}`);
                        }
                        if (ts.isStringLiteral(node)) {
                            // use jsxtext type to prevent unnecessary escape
                            return ts.createJsxText(`intl.get('${id}')`);
                        }
                    }
                }

                // default
                return node;
            });

            if (sourceFile.getImportDeclaration('react-intl-universal')){
                needImport = false;
            }
            
            // import react-intl-universal if necessary. 

            if (needImport) {
                sourceFile.addImportDeclaration({
                    defaultImport: 'intl',
                    moduleSpecifier: 'react-intl-universal'
                });
            }

        });

        
        output(mp).then(()=>{
            return project.save()
        }).catch(e=>console.error(e))

    }
    )


}

main().then(()=>console.log('done')).catch(err=>console.error(err));
