import makeDraggable from "../draggable.js";
import {attachDialogCloseHandlerWithParent} from "../ui-utils.js";
import {div, hide, offset, show, pageCoordinates} from "../dom-utils.js"

class Dialog {

    constructor({label, content, okHandler, cancelHandler}) {


        // dialog container
        this.elem = div({class: 'igv-ui-dialog'});

        // dialog header
        const header = div({class: 'igv-ui-dialog-header'});
        this.elem.appendChild(header);

        attachDialogCloseHandlerWithParent(header, cancel);

        // dialog label
        if(label) {
            const labelDiv = div({class: 'igv-ui-dialog-one-liner'});
            this.elem.appendChild(labelDiv);
            labelDiv.innerHTML = label;
        }

        // input container
        content.elem.style.margin = '8px';
        this.elem.appendChild(content.elem);

        // ok | cancel
        const buttons = div({class: 'igv-ui-dialog-ok-cancel'});
        this.elem.appendChild(buttons);

        // ok
        this.ok = div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        const self = this;
        this.ok.addEventListener('click', function () {
            hide(self.elem);
            if (typeof okHandler === 'function') {
                okHandler(self);
            }
        });

        this.cancel.addEventListener('click', cancel);

        makeDraggable(this.elem, header);

        function cancel() {
            self.canceled = true;
            hide(self.elem);
            if (typeof cancelHandler === 'function') {
                cancelHandler(self);
            }
        }


    }

    present(options, e) {

        this.label.textContent = options.label;
        this.input.value = options.value;
        this.callback = options.callback;

        const page = pageCoordinates(e);
        this.clampLocation(page.x, page.y);

        show(this.elem);
    }

    clampLocation(pageX, pageY) {

        let popoverRect = this.elem.getBoundingClientRect();
        let parentRect = this.parent.getBoundingClientRect();
        const y = Math.min(Math.max(pageY, parentRect.y), parentRect.y + parentRect.height - popoverRect.height);
        const x = Math.min(Math.max(pageX, parentRect.x), parentRect.x + parentRect.width - popoverRect.width);
        this.elem.style.left = x + "px";
        this.elem.style.top = y + "px";
    }
}

export default Dialog
