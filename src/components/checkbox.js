import {div, hide} from "../dom-utils.js";
import {createIcon} from "../bootstrap-icons.js";

class Checkbox {

    constructor({selected, label, handler}) {

        this.state = selected;
        this.elem = div({class: 'igv-ui-trackgear-popover-check-container'});
        this.svg = createIcon('check', (true === selected ? '#444' : 'transparent'));
        this.elem.style.borderColor = 'gray';
        this.elem.style.borderWidth = '1px';
        this.elem.style.borderStyle = 'solid';

        this.elem.appendChild(this.svg);

        if (label) {
            let d = div(); //{ class: 'igv-some-label-class' });
            d.textContent = label;
            this.elem.appendChild(d);
        }

        this.elem.addEventListener('click', handleClick);
        this.elem.addEventListener('touchend', handleClick);

        const that = this;
        function handleClick(e) {
            e.preventDefault();
            e.stopPropagation();
            that.selected = !that.state;
            const s = that.state;
            if (typeof handler === 'function') {
                handler(s);
            }
        }
    }

    set selected(selected) {
        this.state = selected;
        this.svg.path.setAttributeNS(null, 'fill', (true === selected ? '#444' : 'transparent'));
    }
}

export default Checkbox;