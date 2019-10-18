/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//import makeDraggable from "./draggable.js";

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

    //makeDraggable(this.container, header);
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
    this.container.style.display = 'block';
};

export default AlertDialog;