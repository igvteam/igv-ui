import { DOMUtils } from '../../node_modules/igv-utils/src/index.js'

class Textbox {

    constructor({text: value, label, onchange}) {

        this.elem = DOMUtils.div({class: 'igv-ui-textbox'});

        if(label) {
            const div = DOMUtils.div();
            div.innerHTML = label;
            this.elem.appendChild(div);
        }

        this.textBox = DOMUtils.create('input');
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
