const fse = require('fs-extra')
const fs = require('fs');
const path = require('path')

const srcDir = path.join(__dirname, '../js')
const destDir = path.join(__dirname, '../build')

if(fs.existsSync(destDir)) {
    fs.rmdirSync(destDir, {force: true, recursive: true})
}
fse.mkdirpSync(destDir)

const package = require('../package.json')
const version = package.version
const classPrefix = 'igv-ui-' + version.replace(/\./g, '_')

// 1. Generate embedding function
const cssPath = require.resolve('../css/igv-ui.css')
const cssContents = fs.readFileSync(cssPath, 'utf-8').replace(/igv-ui/g, classPrefix )
const embbedingSrc = `
function embedCSS() {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('title', '${classPrefix}.css')
    style.innerHTML = \`${cssContents}\`
    document.head.insertBefore(style, document.head.childNodes[ document.head.childNodes.length - 1 ]);
}

export default embedCSS
`
const outputPath = `${destDir}/embedCSS.js`
fse.outputFileSync(outputPath, embbedingSrc,  'utf-8');


// 2. Replace css class names in javascript
walk(srcDir)

function walk (dir) {

    const paths = fs.readdirSync(dir)
    for (let p of paths) {

        const inputPath = dir + path.sep + p
        const st = fs.statSync(inputPath)
        if(st.isDirectory()) {
            walk(inputPath)

        } else if ('embedCSS.js' !== p) {

            const contents = fs.readFileSync(inputPath, {encoding: 'utf-8'})
                .replace(/igv-ui/g, classPrefix )

            const outputPath = inputPath.replace(srcDir, destDir)
            fse.outputFileSync(outputPath, contents,{encoding: 'utf-8'})
        }
    }
}