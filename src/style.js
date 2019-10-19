//Experimental class -- not used.  Idea is to embed css on element style directly rather than inject a stylesheet into
//the DOM.  Good for relatively simple CSS.

class CSSStyle {

    constructor(css, parent) {
        css = css.trim();
        const bracketIdx = css.indexOf("{");
        const className = css.substr(1, bracketIdx - 1).trim();
        const endBracketIdx = css.indexOf("}")
        const bodyCSS = css.substr(bracketIdx+1, endBracketIdx-1).trim();
        const properties = bodyCSS.split(/;/g);

        this.style = Object.create(null);
        if(parent) {
            Object.assign(this.style, parent.style);
        }
        for(let p of properties) {
            const kv = p.split(":");
            if(kv.length < 2) continue
            const key = kv[0].trim();
            const value = kv[1].trim();
            this.style[key] = isNumeric(value) ? Number.parseFloat(value) : value;
        }
    }

    apply(element) {
        const entries = Object.entries(this.style);
        for(let kv of entries) {
            element.style[kv[0]] = kv[1];
        }
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const styles = Object.create(null);

styles["igv-alert-dialog-container"] = new CSSStyle(
`
.igv-alert-dialog-container {
  position: fixed;
  z-index: 2048;
  top: 50%;
  left: 50%;
  margin: -150px 0 0 -150px;
  width: 300px;
  height: 256px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 400;
  z-index: 2048;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center; }
 `
);