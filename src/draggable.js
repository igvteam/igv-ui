/**
 * Make the target element movable by clicking and dragging on the handle.  This is not a general purprose function,
 * it makes several options specific to igv dialogs, the primary one being that the
 * target is absolutely positioned in pixel coordinates

 */

let dragData;   // Its assumed we are only dragging one element at a time.


function makeDraggable(target, handle) {
    handle.addEventListener('mousedown', dragStart.bind(target));
}


function dragStart(event) {

    event.stopPropagation();
    event.preventDefault();
    const styleX = Math.round(parseFloat(this.style.left.replace("px", "")));
    const styleY = Math.round(parseFloat(this.style.top.replace("px", "")));
    const dragFunction = drag.bind(this);
    const dragEndFunction = dragEnd.bind(this);

    dragData =
        {
            dragFunction: dragFunction,
            dragEndFunction: dragEndFunction,
            dx: styleX - event.screenX,
            dy: styleY - event.screenY
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
    document.addEventListener('mousemove', dragFunction);
    document.addEventListener('mouseup', dragEndFunction);
    document.addEventListener('mouseleave', dragEndFunction);
    document.addEventListener('mouseexit', dragEndFunction);
  //  dragData = undefined;
}

export default makeDraggable;