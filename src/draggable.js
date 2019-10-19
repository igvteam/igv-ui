/**
 * Make the target element movable by clicking and dragging on the handle.  This is not a general purprose function,
 * it makes several options specific to igv dialogs, the primary one being that the
 * target is absolutely positioned in pixel coordinates

 */

import {offset} from "./dom-utils.js"

let dragData;   // Its assumed we are only dragging one element at a time.


function makeDraggable(target, handle) {
    handle.addEventListener('mousedown', dragStart.bind(target));
}


function dragStart(event) {

    event.stopPropagation();
    event.preventDefault();

    const pageCoords = offset(this);
    const dragFunction = drag.bind(this);
    const dragEndFunction = dragEnd.bind(this);

    dragData =
        {
            dragFunction: dragFunction,
            dragEndFunction: dragEndFunction,
            dx: pageCoords.left - event.screenX,
            dy: pageCoords.top - event.screenY
        };

    document.addEventListener('mousemove', dragFunction);
    document.addEventListener('mouseup', dragEndFunction);
    document.addEventListener('mouseleave', dragEndFunction);
    document.addEventListener('mouseexit', dragEndFunction);
}

function drag(event) {

    if (!dragData) {
        console.log("No drag data!");
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    const styleX = dragData.dx + event.screenX;
    const styleY = dragData.dy + event.screenY;
    this.style.left = styleX + "px";
    this.style.top = styleY + "px";

    // console.log('drag ' + 'x ' + styleX + ' y ' + styleY);
}

function dragEnd(event) {

    if (!dragData) {
        console.log("No drag data!");
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    const styleX = dragData.dx + event.screenX;
    const styleY = dragData.dy + event.screenY;
    // console.log('drag end ' + 'x ' + styleX + ' y ' + styleY);
    this.style.left = styleX + "px";
    this.style.top = styleY + "px";

    const dragFunction = dragData.dragFunction;
    const dragEndFunction = dragData.dragEndFunction;
    document.removeEventListener('mousemove', dragFunction);
    document.removeEventListener('mouseup', dragEndFunction);
    document.removeEventListener('mouseleave', dragEndFunction);
    document.removeEventListener('mouseexit', dragEndFunction);
    dragData = undefined;
}

export default makeDraggable;