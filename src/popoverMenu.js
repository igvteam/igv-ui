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
import MenuUtils from "./menuUtils.js";
import {attachDialogCloseHandlerWithParent} from "./ui-utils.js";
import {pageCoordinates} from "./dom-utils.js";
import * as dom from "./dom-utils.js"
const trackMenuItemListHelper = MenuUtils.trackMenuItemListHelper

import Popover from "./popover.js"

class PopoverMenu {

    constructor(parent) {
        this.popover = new Popover(parent);
    }
}


Popover.prototype.presentMenu = function (e, menuItems) {

    const popover = this.popover;

    // Only 1 popover open at a time
    dom.hideAll('.igv-ui-popover');

    dom.empty(popover);
    popover.popoverContent.className = ''
    popover.popoverContent.classList.add("igv-ui-popover-track-popup-content");

    if (menuItems.length > 0) {

        menuItems = trackMenuItemListHelper(menuItems, popover);

        dom.empty(this.container.popoverContent);

        for (let item of menuItems) {
            popover.popoverContent.appendChild(item.object);
        }

        const page = pageCoordinates(e);
        clampPopoverLocation(page.x, page.y, this);
        dom.show(popover)
    }

};


function clampPopoverLocation(pageX, pageY, popover) {

    var left,
        containerCoordinates = {x: pageX, y: pageY},
        containerRect = {x: 0, y: 0, width: $(window).width(), height: $(window).height()},
        popupRect,
        popupX = pageX,
        popupY = pageY;

    popupX -= popover.$parent.offset().left;
    popupY -= popover.$parent.offset().top;
    popupRect = {
        x: popupX,
        y: popupY,
        width: popover.$popover.outerWidth(),
        height: popover.$popover.outerHeight()
    };

    left = popupX;
    if (containerCoordinates.x + popupRect.width > containerRect.width) {
        left = popupX - popupRect.width;
    }

    popover.style.left = left + "px";
    popover.style.top =  popupY + "px";
}

export default Popover;

