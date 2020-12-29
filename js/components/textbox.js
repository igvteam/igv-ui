import * as DOMUtils from '../../node_modules/igv-utils/src/dom-utils.js';

class Textbox {

    constructor({value, label, onchange}) {

        this.elem = DOMUtils.div({class: 'igv-ui-generic-dialog-label-input'});

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
