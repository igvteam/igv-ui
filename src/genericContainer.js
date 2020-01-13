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

import makeDraggable from "./draggable.js";
import {div, hide, show} from "./dom-utils.js";
import {attachDialogCloseHandlerWithParent} from "./ui-utils.js"

class GenericContainer {

    constructor({parent,  top, left, width, height, border, closeHandler}) {

        let container = div({class: 'igv-ui-generic-container'});
        parent.appendChild(container);
        hide(container);
        this.container = container;

        if(top !== undefined) {
            this.container.style.width = top + "px";
        }
        if(left !== undefined) {
            this.container.style.width = left + "px";
        }
        if (width !== undefined) {
            this.container.style.width = width + "px";
        }
        if (height !== undefined) {
            this.container.style.height = height + "px";
        }
        if(border) {
            this.container.style.border = border;
        }
        //
        // let bbox = parent.getBoundingClientRect();
        // this.origin = {x: bbox.x, y: bbox.y};
        // this.container.offset({left: this.origin.x, top: this.origin.y});

        // header
        const header = div();
        this.container.appendChild(header);

        // close button
        const ch = closeHandler || function(e) {hide(this.container)};
        attachDialogCloseHandlerWithParent(header, ch);

        makeDraggable(this.container, header);
    }

    show() {
        show(this.container);
    }

    hide() {
        hide(this.container)
    }

    dispose() {
        if(this.container.parent)  {
            this.container.parent.removeChild(this.container);
        }
    }
}

export default GenericContainer;
