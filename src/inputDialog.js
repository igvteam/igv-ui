import makeDraggable from "./draggable.js";
import {attachDialogCloseHandlerWithParent} from "./ui-utils.js";
import {div, hide, show, offset} from "./dom-utils.js"

const InputDialog = function (parent) {

    const self = this;

    // dialog container
    this.container = div({class: 'igv-ui-generic-dialog-container'});
    parent.appendChild(this.container);

    // dialog header
    const header =div({class: 'igv-ui-generic-dialog-header'});
    this.container.appendChild(header);

    attachDialogCloseHandlerWithParent(header, function () {
        self.input.value = undefined;
        hide(self.container);
    });

    // dialog label
    this.label = div({class: 'igv-ui-generic-dialog-one-liner'});
    this.container.appendChild(this.label);
    this.label.text= 'Unlabeled';

    // input container
    this.input_container = div({class: 'igv-ui-generic-dialog-input'});
    this.container.appendChild(this.input_container);
    //
    this.input = document.createElement("input");
    this.input_container.appendChild(this.input);


    // ok | cancel
    const buttons = div({class: 'igv-ui-generic-dialog-ok-cancel'});
    this.container.appendChild(buttons);

    // ok
    this.ok = div();
    buttons.appendChild(this.ok);
    this.ok.textContent = 'OK';

    // cancel
    this.cancel = div();
    buttons.appendChild(this.cancel);
    this.cancel.textContent = 'Cancel';



    //this.$container.draggable({ handle:$header.get(0) });
    makeDraggable(this.container, header);

    hide(this.container);

    this.input.addEventListener('keyup', function (e) {
        if (13 === e.keyCode) {
            if(typeof self.callback === 'function') {
                self.callback(self.input.value);
                self.callback = undefined;
            }
            self.input.value = undefined;
            hide(self.container);
        }
    });

    this.ok.addEventListener('click', function () {
        if(typeof self.callback === 'function') {
            self.callback(self.input.value);
            self.callback = undefined;
        }
        self.input.value = undefined;
        hide(self.container);
    });

    this.cancel.addEventListener('click', function () {
        if(typeof self.callback === 'function') {
            self.callback(undefined);
            self.callback = undefined;
        }
        self.input.value = undefined;
        self.container.hide();
    });

};

InputDialog.prototype.present = function (options, parent) {

    this.label.textContent = options.label;
    this.input.value = options.value;
    this.callback = options.callback;

    const pageCoords = offset(options.parent);
    const rect = options.parent.getBoundingClientRect();

    this.container.style.top = `${pageCoords.top + Math.floor(rect.height / 2)}px`;
    this.container.style.left = `${pageCoords.left + Math.floor(rect.width / 2)}px`;

    show(this.container);
};

export default InputDialog;
