const fse = require('fs-extra')
const fs = require('fs');
const path = require('path')

const srcDir = path.join(__dirname, '../src')
const destDir = path.join(__dirname, '../src')

const classPrefix = 'igv-ui'

// 1. Generate embedding function
const cssPath = require.resolve('../css/igv-ui.css')
const cssContents = fs.readFileSync(cssPath, 'utf-8').replace(/igv-ui/g, classPrefix )
const embbedingSrc = `
function embedCSS() {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('title', '${classPrefix}.css')
    style.innerHTML = \`${cssContents}\`
    document.head.append(style);
}

export default embedCSS
`
const outputPath = `${destDir}/embedCSS.js`
fse.outputFileSync(outputPath, embbedingSrc,  'utf-8');
