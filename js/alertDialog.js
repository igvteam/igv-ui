const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


const AlertDialog = function (parent) {

    const self = this;

    // container
    this.container = document.createElement("div");
    this.container.classList.add("igv-alert-dialog-container");
    parent.appendChild(this.container);

    // header
    let header = document.createElement("div");
    this.container.appendChild(header);

    // body container
    let div = document.createElement("div");
    div.id =  'igv-alert-dialog-body';
    this.container.appendChild(div);

    // body copy
    this.body = document.createElement("div");
    this.body.id=  'igv-alert-dialog-body-copy';
    div.appendChild(this.body);

    // ok container
    let ok_container = document.createElement("div");
    this.container.appendChild(ok_container);

    // ok
    this.ok = document.createElement("div");
    ok_container.appendChild(this.ok);
    this.ok.textContent = 'OK';
    this.ok.addEventListener('click', function () {
        self.body.innerHTML = '';
        self.container.style.display = 'none';
    });

    this.container.style.display = 'none';
};

AlertDialog.prototype.present = function (alert, callback) {
    const self = this;
    let string = alert.message || alert;
    if (httpMessages.hasOwnProperty(string)) {
        string = httpMessages[string];
    }
    this.body.innerHTML = string;
    this.ok.addEventListener('click', function () {
        if(typeof callback === 'function') {
            callback("OK");
        }
        self.body.innerHTML = '';
        self.container.style.display = 'none';
    });
    this.container.style.display = 'flex';
};

export default AlertDialog;