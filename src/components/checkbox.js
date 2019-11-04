import {div} from "../dom-utils.js";
import {createIcon} from "../bootstrap-icons.js";

const style = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
}

class Checkbox {

    constructor({selected, label, onchange: handler}) {

        this.state = selected;
        this.onchange = handler;
        this.elem = div({style: style});

        const svgDiv = div({
            style: {
                width: '14px',
                height: '14px',
                borderColor: 'gray',
                borderWidth: '1px',
                borderStyle: 'solid'
            }
        })
        this.svg = createIcon('check', (true === selected ? '#444' : 'transparent'));
        this.svg.style.width = '12px';
        this.svg.style.height = '12px';
        svgDiv.appendChild(this.svg);
        this.elem.appendChild(svgDiv);

        if (label) {
            const d = div({style: {marginLeft: '5px'}}); //{ class: 'igv-some-label-class' });
            d.textContent = label
            this.elem.appendChild(d);
        }

        this.elem.addEventListener('click', handleClick);
        this.elem.addEventListener('touchend', handleClick);

        const that = this;

        function handleClick(e) {
            e.preventDefault();
            e.stopPropagation();
            const newState = !that.state;
            that.selected = newState;
            if (typeof this.onchange === 'function') {
                this.onchange(newState);
            }
        }
    }

    set selected(selected) {
        this.state = selected;
        const p = this.svg.querySelector('path');
        p.setAttributeNS(null, 'fill', (true === selected ? '#444' : 'transparent'));
    }

    get selected() {
        return this.state;
    }

    onchange(handler) {
        this.onchange = handler;
    }


}

export default Checkbox;