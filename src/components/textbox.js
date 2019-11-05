import * as DomUtils from "../dom-utils.js"

class Textbox {

    constructor({text: value, label, onchange}) {

        this.elem = DomUtils.div({class: 'igv-ui-textbox'});

        if(label) {
            const div = DomUtils.div();
            div.innerHTML = label;
            this.elem.appendChild(div);
        }

        this.textBox = DomUtils.create('input');
        if(value) {
            this.textBox.value = value;
        }
        this.elem.appendChild(this.textBox);

        if(onchange) {
            this.textBox.addEventListener('change', (e) => onchange(this.textBox.value))
        }
    }

    get value() {
        return this.textBox.value;
    }

    set value(v) {
        this.textBox.value = v;
    }
}


export default Textbox