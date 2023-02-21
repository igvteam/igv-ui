import * as UIUtils from "../utils/ui-utils.js"
import * as DOMUtils from "../utils/dom-utils.js"
import makeDraggable from "../utils/draggable.js"

class InputDialog {

    constructor(parent) {

        this.parent = parent;

        // dialog container
        this.container = DOMUtils.div({class: 'igv-ui-generic-dialog-container'});
        parent.appendChild(this.container);

        // const { x, y, width, height } = this.container.getBoundingClientRect();
        // console.log(`InputDialog - x ${ x } y ${ y } width ${ width } height ${ height }`)

        // dialog header
        const header = DOMUtils.div({class: 'igv-ui-generic-dialog-header'});
        this.container.appendChild(header);

        // dialog label
        this.label = DOMUtils.div({class: 'igv-ui-generic-dialog-one-liner'});
        this.container.appendChild(this.label);
        this.label.text = 'Unlabeled';

        // input container
        this.input_container = DOMUtils.div({class: 'igv-ui-generic-dialog-input'});
        this.container.appendChild(this.input_container);
        //
        this.input = document.createElement("input");
        this.input_container.appendChild(this.input);


        // ok | cancel
        const buttons = DOMUtils.div({class: 'igv-ui-generic-dialog-ok-cancel'});
        this.container.appendChild(buttons);

        // ok
        this.ok = DOMUtils.div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = DOMUtils.div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        DOMUtils.hide(this.container);

        this.input.addEventListener('keyup', e => {
            if (13 === e.keyCode) {
                if (typeof this.callback === 'function') {
                    this.callback(this.input.value);
                    this.callback = undefined;
                }
                this.input.value = undefined;
                DOMUtils.hide(this.container);
            }
        });

        this.ok.addEventListener('click', () => {
            if (typeof this.callback === 'function') {
                this.callback(this.input.value);
                this.callback = undefined;
            }
            this.input.value = undefined;
            DOMUtils.hide(this.container);
        });

        const cancel = () => {
            this.input.value = '';
            DOMUtils.hide(this.container);
        }

        this.cancel.addEventListener('click', cancel);

        UIUtils.attachDialogCloseHandlerWithParent(header, cancel);
        makeDraggable(this.container, header);

    }

    present(options, e) {

        this.label.textContent = options.label;
        this.input.value = options.value;
        this.callback = options.callback || options.click;

        DOMUtils.show(this.container);
        const { x, y } = DOMUtils.pageCoordinates(e);
        this.clampLocation(x, y);

    }

    clampLocation(pageX, pageY) {

        const { width:w, height:h } = this.container.getBoundingClientRect();

        const { x:px, y:py, width:pw, height:ph } = this.parent.getBoundingClientRect();

        const y = Math.min(Math.max(pageY, py), py + ph - h);
        const x = Math.min(Math.max(pageX, px), px + pw - w);
        this.container.style.left = `${ x }px`;
        this.container.style.top  = `${ y }px`;
    }
}

export default InputDialog
