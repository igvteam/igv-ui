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
import {attachDialogCloseHandlerWithParent} from "./ui-utils.js";
import * as dom from "./dom-utils.js";
import {createCheckbox} from "./bootstrap-icons.js"

class Popover {

    constructor(parent) {

        const self = this;

        this.parent = parent;

        // popover container
        this.popover = dom.div({class: "igv-ui-popover"});
        parent.appendChild(this.popover);

        // popover header
        const popoverHeader = dom.div({class: "igv-ui-popover-header"});
        this.popover.appendChild(popoverHeader);
        attachDialogCloseHandlerWithParent(popoverHeader, function () {
            dom.hide(self.popover);
        });

        // popover content
        this.popoverContent = dom.div({class: "igv-ui-popover-track-popup-content"});
        this.popover.appendChild(this.popoverContent);

        makeDraggable(this.popover, popoverHeader);
    }

    hide() {
        dom.hide(this.popover);
    }

    dispose() {
        dom.empty(this.popover);
        Object.keys(this).forEach(function (key) {
            this[key] = undefined;
        })
    }

    presentMenu(e, menuItems) {

        const popover = this.popover;

        // Only 1 popover open at a time
        dom.hideAll('.igv-ui-popover');

        dom.empty(this.popoverContent);

        if (menuItems.length > 0) {
            const menuElements = createMenuElements(menuItems, popover);
            for (let item of menuElements) {
                this.popoverContent.appendChild(item.object);
            }

            const page = dom.pageCoordinates(e);
            this.clampLocation(page.x, page.y);
            dom.show(popover);
        }
    }

    presentContent(pageX, pageY, content) {

        // Only 1 popover open at a time
        dom.hideAll('.igv-ui-popover');

        if (undefined === content) {
            return;
        }

        dom.empty(this.popoverContent);

        this.popoverContent.innerHTML = content;
        this.clampLocation(pageX, pageY);
        dom.show(this.popover);

    }

    clampLocation(pageX, pageY) {

        let popoverRect = this.popover.getBoundingClientRect();
        let parentRect = this.parent.getBoundingClientRect();
        const y = Math.min(Math.max(pageY, parentRect.y), parentRect.y + parentRect.height - popoverRect.height);
        const x = Math.min(Math.max(pageX, parentRect.x), parentRect.x + parentRect.width - popoverRect.width);
        this.popover.style.left = x + "px";
        this.popover.style.top = y + "px";
    }
}

function createMenuElements(itemList, popover) {

    let list;
    if (itemList.length > 0) {

        list = itemList.map(function (item, i) {
            let elem;

            if (typeof item === 'string') {
                elem = dom.div();
                elem.innerHTML = item;
            } else if (typeof item === 'Node') {
                elem = item;
            } else {
                if (typeof item.init === 'function') {
                    item.init();
                }

                if ("checkbox" === item.type) {
                    elem = createCheckbox("Show all bases", item.value);
                } else {
                    elem = dom.div();
                    if (typeof item.label === 'string') {
                        elem.textContent = item.label;
                    }
                }

                if (item.click) {
                    elem.addEventListener('click', handleClick);
                    elem.addEventListener('touchend', handleClick);
                    elem.addEventListener('mouseup', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })

                    // eslint-disable-next-line no-inner-declarations
                    function handleClick(e) {
                        item.click();
                        dom.hide(popover);
                        e.preventDefault();
                        e.stopPropagation()
                    }
                }
            }


            return {object: elem, init: item.init};
        })
    } else {
        list = [];
    }
    return list;
}


export default Popover;

