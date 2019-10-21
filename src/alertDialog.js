import {div, hide, show} from "./dom-utils.js"

const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


const AlertDialog = function (parent) {

    const self = this;

    // container
    this.container = div({class: "igv-ui-alert-dialog-container"});
    parent.appendChild(this.container);

    // header
    let header = div();
    this.container.appendChild(header);

    // body container
    let bodyContainer = div({id: 'igv-ui-alert-dialog-body'});
    this.container.appendChild(bodyContainer);

    // body copy
    this.body = div({id: 'igv-ui-alert-dialog-body-copy'});
    bodyContainer.appendChild(this.body);

    // ok container
    let ok_container = div();
    this.container.appendChild(ok_container);

    // ok
    this.ok = div();
    ok_container.appendChild(this.ok);
    this.ok.textContent = 'OK';
    this.ok.addEventListener('click', function (ev) {
        if (typeof self.callback === 'function') {
            self.callback("OK");
            self.callback = undefined;
        }
        self.body.innerHTML = '';
        hide(self.container);
    });

    hide(this.container);
};

AlertDialog.prototype.present = function (alert, callback) {
    let string = alert.message || alert;
    if (httpMessages.hasOwnProperty(string)) {
        string = httpMessages[string];
    }
    this.body.innerHTML = string;
    this.callback = callback;
    show(this.container, "flex");
};

export default AlertDialog;