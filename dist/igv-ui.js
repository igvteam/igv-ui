function div(options) {
    return create("div", options);
}

function create(tag, options) {
    const elem = document.createElement(tag);
    if (options) {
        if (options.class) {
            elem.classList.add(options.class);
        }
        if (options.id) {
            elem.id = options.id;
        }
        if(options.style) {
            applyStyle(elem, options.style);
        }
    }
    return elem;
}

function hide(elem) {
    const cssStyle = getComputedStyle(elem);
    if(cssStyle.display !== "none") {
        elem._initialDisplay = cssStyle.display;
    }
    elem.style.display = "none";
}

function show(elem) {
    const currentDisplay = getComputedStyle(elem).display;
    if (currentDisplay === "none") {
        const d = elem._initialDisplay || "block";
        elem.style.display = d;
    }
}

function offset(elem) {
    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!elem.getClientRects().length) {
        return {top: 0, left: 0};
    }

    // Get document-relative position by adding viewport scroll to viewport-relative gBCR
    const rect = elem.getBoundingClientRect();
    const win = elem.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };
}

function pageCoordinates(e) {

    if (e.type.startsWith("touch")) {
        const touch = e.touches[0];
        return {x: touch.pageX, y: touch.pageY};
    } else {
        return {x: e.pageX, y: e.pageY}
    }
}

function applyStyle(elem, style) {
    for (let key of Object.keys(style)) {
        elem.style[key] = style[key];
    }
}

let getMouseXY = (domElement, { clientX, clientY }) => {

    // DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
    const { left, top, width, height } = domElement.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;
    return { x, y, xNormalized: x/width, yNormalized: y/height, width, height };

};

/**
 * Translate the mouse coordinates for the event to the coordinates for the given target element
 * @param event
 * @param domElement
 * @returns {{x: number, y: number}}
 */
function translateMouseCoordinates(event, domElement) {

    const { clientX, clientY } = event;
    return getMouseXY(domElement, { clientX, clientY });

}

class Textbox {

    constructor({value, label, onchange}) {

        this.elem = div({class: 'igv-ui-generic-dialog-label-input'});

        if(label) {
            const div$1 = div();
            div$1.innerHTML = label;
            this.elem.appendChild(div$1);
        }

        this.textBox = create('input');
        if(value) {
            this.textBox.value = value;
        }
        this.elem.appendChild(this.textBox);

        if(onchange) {
            this.textBox.addEventListener('change', (e) => onchange(this.textBox.value));
        }
    }

    get value() {
        return this.textBox.value;
    }

    set value(v) {
        this.textBox.value = v;
    }
}

/**
 * Generic container for UI components
 */
class Panel {

    constructor() {

        this.elem = create('div', {
            class: 'igv-ui-panel-column'
        });
    }

    add(component) {

        if(component instanceof Node) {
            this.elem.append(component);
        }
        else if(typeof component === 'object') {
            this.elem.append(component.elem);
        }
        else {
            // Assuming a string, possibly html
            const wrapper = div();
            wrapper.innerHTML = component;
            this.elem.append(wrapper);
        }
    }


}

function createCheckbox(name, initialState) {
    const container = div({class: 'igv-ui-trackgear-popover-check-container'});
    const svg = iconMarkup('check', (true === initialState ? '#444' : 'transparent'));
    svg.style.borderColor = 'gray';
    svg.style.borderWidth = '1px';
    svg.style.borderStyle = 'solid';

    container.appendChild(svg);
    let label = div(); //{ class: 'igv-some-label-class' });
    label.textContent = name;
    container.appendChild(label);

    return container;
}

function createIcon(name, color) {
    return iconMarkup(name, color);
}

function iconMarkup(name, color) {
    color = color || "currentColor";
    let icon = icons[name];
    if (!icon) {
        console.error(`No icon named: ${name}`);
        icon = icons["question"];
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null,'viewBox', '0 0 ' + icon[0] + ' ' + icon[1]);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null,'fill',  color );
    path.setAttributeNS(null,'d', icon[4]);
    svg.appendChild(path);
    return svg;
}

const icons = {
    "check": [512, 512, [], "f00c", "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"],
    "cog": [512, 512, [], "f013", "M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"],
    "exclamation": [192, 512, [], "f12a", "M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"],
    "exclamation-circle": [512, 512, [], "f06a", "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"],
    "exclamation-triangle": [576, 512, [], "f071", "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"],
    "minus": [448, 512, [], "f068", "M424 318.2c13.3 0 24-10.7 24-24v-76.4c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h400z"],
    "minus-circle": [512, 512, [], "f056", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"],
    "minus-square": [448, 512, [], "f146", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM92 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H92z"],
    "plus": [448, 512, [], "f067", "M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"],
    "plus-circle": [512, 512, [], "f055", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"],
    "plus-square": [448, 512, [], "f0fe", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"],
    "question": [384, 512, [], "f128", "M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"],
    "save": [448, 512, [], "f0c7", "M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"],
    "search": [512, 512, [], "f002", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"],
    "share": [512, 512, [], "f064", "M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z"],
    "spinner": [512, 512, [], "f110", "M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"],
    "square": [448, 512, [], "f0c8", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"],
    "square-full": [512, 512, [], "f45c", "M512 512H0V0h512v512z"],
    "times": [384, 512, [], "f00d", "M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"],
    "times-circle": [512, 512, [], "f057", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"],
    "wrench": [512, 512, [], "f0ad", "M481.156 200c9.3 0 15.12 10.155 10.325 18.124C466.295 259.992 420.419 288 368 288c-79.222 0-143.501-63.974-143.997-143.079C223.505 65.469 288.548-.001 368.002 0c52.362.001 98.196 27.949 123.4 69.743C496.24 77.766 490.523 88 481.154 88H376l-40 56 40 56h105.156zm-171.649 93.003L109.255 493.255c-24.994 24.993-65.515 24.994-90.51 0-24.993-24.994-24.993-65.516 0-90.51L218.991 202.5c16.16 41.197 49.303 74.335 90.516 90.503zM104 432c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24z"],
};

function attachDialogCloseHandlerWithParent(parent, closeHandler) {

    var container = document.createElement("div");
    parent.appendChild(container);
    container.appendChild(createIcon("times"));
    container.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeHandler();
    });
}

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

    const pageCoords = offset(this);
    const dragFunction = drag.bind(this);
    const dragEndFunction = dragEnd.bind(this);
    const computedStyle = getComputedStyle(this);
    const top = parseInt(computedStyle.top.replace("px", ""));
    const left = parseInt(computedStyle.left.replace("px", ""));

    dragData =
        {
            dragFunction: dragFunction,
            dragEndFunction: dragEndFunction,
            screenX: event.screenX,
            screenY: event.screenY,
            top: top,
            left: left
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
    const dx = event.screenX - dragData.screenX;
    const dy = event.screenY - dragData.screenY;
    this.style.left = `${dragData.left + dx}px`;
    this.style.top = `${dragData.top + dy}px`;
}

function dragEnd(event) {

    if (!dragData) {
        console.log("No drag data!");
        return;
    }
    event.stopPropagation();
    event.preventDefault();

    const dragFunction = dragData.dragFunction;
    const dragEndFunction = dragData.dragEndFunction;
    document.removeEventListener('mousemove', dragFunction);
    document.removeEventListener('mouseup', dragEndFunction);
    document.removeEventListener('mouseleave', dragEndFunction);
    document.removeEventListener('mouseexit', dragEndFunction);
    dragData = undefined;
}

class Dialog {

    constructor({label, content, okHandler, cancelHandler}) {

        const cancel = () => {
            hide(this.elem);
            if (typeof cancelHandler === 'function') {
                cancelHandler(this);
            }
        };

        // dialog container
        this.elem = div({class: 'igv-ui-generic-dialog-container'});

        // dialog header
        const header = div({class: 'igv-ui-generic-dialog-header'});
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
        const buttons = div({class: 'igv-ui-generic-dialog-ok-cancel'});
        this.elem.appendChild(buttons);

        // ok
        this.ok = div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        this.ok.addEventListener('click',  (e) => {
            hide(this.elem);
            if (typeof okHandler === 'function') {
                okHandler(this);
            }
        });

        this.cancel.addEventListener('click', cancel);

        makeDraggable(this.elem, header);


        // Consume all clicks in component
        this.elem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

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

class DataRangeDialog {

    constructor(parent, okHandler) {

        const panel = new Panel();
        this.minbox = new Textbox({label: "Minimum", value: "0"});
        panel.add(this.minbox);

        this.maxbox = new Textbox({label: "Maximum", value: "0"});
        panel.add(this.maxbox);

        let callback;
        if (okHandler) {
            callback = (e) => {
                okHandler(Number.parseFloat(this.minbox.value), Number.parseFloat(this.maxbox.value));
            };
        } else {
            callback = (d) => {
                console.log(`Minimum: ${this.minbox.value}`);
                console.log(`Maximum: ${this.maxbox.value}`);
            };
        }

        this.dialog = new Dialog({
            //label: 'Multi-select',
            content: panel,
            okHandler: callback
        });

        // Overide some css styles -- TODO redesign this.
        this.dialog.elem.style.position = "absolute";

        hide(this.dialog.elem);
        parent.appendChild(this.dialog.elem);
    }

    show({min, max}) {
        if (min !== undefined) this.minbox.value = min.toString();
        if (max !== undefined) this.maxbox.value = max.toString();
        show(this.dialog.elem);
    }
}

const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


class AlertDialog {
    constructor(parent) {

        // container
        this.container = div({class: "igv-ui-alert-dialog-container"});
        parent.appendChild(this.container);
        this.container.setAttribute('tabIndex', '-1');

        // header
        const header = div();
        this.container.appendChild(header);

        this.errorHeadline = div();
        header.appendChild(this.errorHeadline);
        this.errorHeadline.textContent = '';

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

        const okHandler = () => {

            if (typeof this.callback === 'function') {
                this.callback("OK");
                this.callback = undefined;
            }
            this.body.innerHTML = '';
            hide(this.container);
        };

        this.ok.addEventListener('click', event => {

            event.stopPropagation();

            okHandler();
        });

        this.container.addEventListener('keypress', event => {

            event.stopPropagation();

            if ('Enter' === event.key) {
                okHandler();
            }
        });

        makeDraggable(this.container, header);

        hide(this.container);
    }

    present(alert, callback) {

        this.errorHeadline.textContent = alert.message ? 'ERROR' : '';
        let string = alert.message || alert;

        if (httpMessages.hasOwnProperty(string)) {
            string = httpMessages[string];
        }

        this.body.innerHTML = string;
        this.callback = callback;
        show(this.container);
        this.container.focus();
    }
}

class AlertSingleton {
    constructor(root) {

        if (root) {
            this.alertDialog = undefined;
        }
    }

    init(root) {
        this.alertDialog = new AlertDialog(root);
    }

    present(alert, callback) {
        this.alertDialog.present(alert, callback);
    }

}

var alertSingleton = new AlertSingleton();

// The global Alert dialog

let alertDialog;

const Alert = {

    init(root) {
        if (!alertDialog) {
            alertDialog = new AlertDialog(root);
        }
    },

    presentAlert (alert, callback) {
        if(!alertDialog) {
            this.init(document.body);
        }
        alertDialog.present(alert, callback);
    },
};

class InputDialog {

    constructor(parent) {

        this.parent = parent;

        // dialog container
        this.container = div({class: 'igv-ui-generic-dialog-container'});
        parent.appendChild(this.container);

        // const { x, y, width, height } = this.container.getBoundingClientRect();
        // console.log(`InputDialog - x ${ x } y ${ y } width ${ width } height ${ height }`)

        // dialog header
        const header = div({class: 'igv-ui-generic-dialog-header'});
        this.container.appendChild(header);

        // dialog label
        this.label = div({class: 'igv-ui-generic-dialog-one-liner'});
        this.container.appendChild(this.label);
        this.label.text = 'Unlabeled';

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

        hide(this.container);

        this.input.addEventListener('keyup', e => {
            if (13 === e.keyCode) {
                if (typeof this.callback === 'function') {
                    this.callback(this.input.value);
                    this.callback = undefined;
                }
                this.input.value = undefined;
                hide(this.container);
            }
        });

        this.ok.addEventListener('click', () => {
            if (typeof this.callback === 'function') {
                this.callback(this.input.value);
                this.callback = undefined;
            }
            this.input.value = undefined;
            hide(this.container);
        });

        const cancel = () => {
            this.input.value = '';
            hide(this.container);
        };

        this.cancel.addEventListener('click', cancel);

        attachDialogCloseHandlerWithParent(header, cancel);
        makeDraggable(this.container, header);

    }

    present(options, e) {

        this.label.textContent = options.label;
        this.input.value = options.value;
        this.callback = options.callback || options.click;

        show(this.container);
        const { x, y } = pageCoordinates(e);
        this.clampLocation(x, y);

    }

    clampLocation(pageX, pageY) {

        const { width:w, height:h } = this.container.getBoundingClientRect();

        const { x:px, y:py, width:pw, height:ph } = this.parent.getBoundingClientRect();

        const y = Math.min(Math.max(pageY, py), py + ph - h);
        const x = Math.min(Math.max(pageX, px), px + pw - w);
        this.container.style.left = `${ x }px`;
        this.container.style.top  = `${ y }px`;
    }
}

const appleCrayonPalette =
    {
        licorice: "#000000",
        lead: "#1e1e1e",
        tungsten: "#3a3a3a",
        iron: "#545453",
        steel: "#6e6e6e",
        tin: "#878687",
        nickel: "#888787",
        aluminum: "#a09fa0",
        magnesium: "#b8b8b8",
        silver: "#d0d0d0",
        mercury: "#e8e8e8",
        snow: "#ffffff",
        //
        cayenne: "#891100",
        mocha: "#894800",
        aspargus: "#888501",
        fern: "#458401",
        clover: "#028401",
        moss: "#018448",
        teal: "#008688",
        ocean: "#004a88",
        midnight: "#001888",
        eggplant: "#491a88",
        plum: "#891e88",
        maroon: "#891648",
        //
        maraschino: "#ff2101",
        tangerine: "#ff8802",
        lemon: "#fffa03",
        lime: "#83f902",
        spring: "#05f802",
        seam_foam: "#03f987",
        turquoise: "#00fdff",
        aqua: "#008cff",
        blueberry: "#002eff",
        grape: "#8931ff",
        magenta: "#ff39ff",
        strawberry: "#ff2987",
        //
        salmon: "#ff726e",
        cantaloupe: "#ffce6e",
        banana: "#fffb6d",
        honeydew: "#cefa6e",
        flora: "#68f96e",
        spindrift: "#68fbd0",
        ice: "#68fdff",
        sky: "#6acfff",
        orchid: "#6e76ff",
        lavender: "#d278ff",
        bubblegum: "#ff7aff",
        carnation: "#ff7fd3"
    };

//import { DOMUtils, UIUtils, makeDraggable } from '../node_modules/igv-utils/src/index.js'


class GenericContainer {

    constructor({parent,  top, left, width, height, border, closeHandler}) {

        let container = div({class: 'igv-ui-generic-container'});
        parent.appendChild(container);
        hide(container);
        this.container = container;

        if(top !== undefined) {
            this.container.style.top = `${ top }px`;
        }
        if(left !== undefined) {
            this.container.style.left = `${ left }px`;
        }
        if (width !== undefined) {
            this.container.style.width = `${ width }px`;
        }
        if (height !== undefined) {
            this.container.style.height = `${ height }px`;
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
        attachDialogCloseHandlerWithParent(header, (e) => {
            hide(this.container);
            if(typeof closeHandler === "function") {
                closeHandler(e);
            }
        });

        makeDraggable(this.container, header);
    }

    show() {
        show(this.container);
    }

    hide() {
        hide(this.container);
    }

    dispose() {
        if(this.container.parent)  {
            this.container.parent.removeChild(this.container);
        }
    }
}

class ColorPicker extends GenericContainer {

    constructor({parent, top, left, width, height, defaultColors, colorHandler}) {

        super({ parent, top, left, width, height, border: '1px solid gray'});

        createColorSwatchSelector(this.container, colorHandler, defaultColors);
    }

}

const createColorSwatchSelector = (container, colorHandler, defaultColors) => {

    const hexColorStrings = Object.values(appleCrayonPalette);

    for (let hexColorString of hexColorStrings) {
        const swatch = div({ class: 'igv-ui-color-swatch' });
        container.appendChild(swatch);
        decorateSwatch(swatch, hexColorString, colorHandler);
    }

    if (defaultColors) {
        for (let hexColorString of defaultColors) {
            const swatch = div({ class: 'igv-ui-color-swatch' });
            container.appendChild(swatch);
            decorateSwatch(swatch, hexColorString, colorHandler);
        }
    }

};

const decorateSwatch = (swatch, hexColorString, colorHandler) => {

    swatch.style.backgroundColor = hexColorString;

    swatch.addEventListener('mouseenter', e => swatch.style.borderColor = hexColorString);

    swatch.addEventListener('mouseleave', e => swatch.style.borderColor = 'white');

    swatch.addEventListener('click', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

    swatch.addEventListener('touchend', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

};

class Popover {

    constructor(parent, title) {

        this.parent = parent;

        // popover
        this.popover = div({ class: "igv-ui-popover" });
        parent.appendChild(this.popover);

        // header
        const popoverHeader = div();
        this.popover.appendChild(popoverHeader);

        const titleElement = div();
        popoverHeader.appendChild(titleElement);
        if (title) {
            titleElement.textContent = title;
        }

        attachDialogCloseHandlerWithParent(popoverHeader,  () => this.hide());
        makeDraggable(this.popover, popoverHeader);

        // content
        this.popoverContent = div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none';


    }

    presentContentWithEvent(e, content) {

        this.popover.style.display = 'block';

        this.popoverContent.innerHTML = content;

        present(e, this.popover);

    }

    presentMenu(e, menuItems) {

        if (0 === menuItems.length) {
            return
        }

        this.popover.style.display = 'block';

        const menuElements = createMenuElements(menuItems, this.popover);
        for (let item of menuElements) {
            this.popoverContent.appendChild(item.object);
        }

        present(e, this.popover);
    }

    hide() {
        this.popover.style.display = 'none';
        this.dispose();
    }

    dispose() {

        if (this.popover) {
            this.popover.parentNode.removeChild(this.popover);
        }

        const keys = Object.keys(this);
        for (let key of keys) {
            this[ key ] = undefined;
        }
    }

}

function present(e, popover) {

    const { x, y } = translateMouseCoordinates(e, popover.parentNode);

    // parent bbox
    const { width } = popover.parentNode.getBoundingClientRect();
    const { width: w } = popover.getBoundingClientRect();

    const xmax = x + w;

    popover.style.left = `${ xmax > width ? (x - (xmax - width)) : x }px`;
    popover.style.top  = `${ y }px`;

}

function createMenuElements(itemList, popover) {

    const list  = itemList.map(function (item, i) {
        let elem;

        if (typeof item === 'string') {
            elem = div();
            elem.innerHTML = item;
        } else if (typeof item === 'Node') {
            elem = item;
        } else {
            if (typeof item.init === 'function') {
                item.init();
            }

            if ("checkbox" === item.type) {
                elem = createCheckbox("Show all bases", item.value);
            } else if("color" === item.type) {
                const colorPicker = new ColorPicker({
                    parent: popover.parentElement,
                    width: 364,
                    //defaultColor: 'aqua',
                    colorHandler: (color) => item.click(color)
                });
                elem = div();
                if (typeof item.label === 'string') {
                    elem.innerHTML = item.label;
                }
                const clickHandler =  e => {
                    colorPicker.show();
                    hide(popover);
                    e.preventDefault();
                    e.stopPropagation();
                };
                elem.addEventListener('click', clickHandler);
                elem.addEventListener('touchend', clickHandler);
                elem.addEventListener('mouseup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            else {
                elem = div();
                if (typeof item.label === 'string') {
                    elem.innerHTML = item.label;
                }
            }

            if (item.click && "color" !== item.type) {
                elem.addEventListener('click', handleClick);
                elem.addEventListener('touchend', handleClick);
                elem.addEventListener('mouseup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

                // eslint-disable-next-line no-inner-declarations
                function handleClick(e) {
                    item.click();
                    hide(popover);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }


        return { object: elem, init: item.init };
    });

    return list;
}

const style = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
};

class Checkbox {

    constructor({selected, label, onchange}) {

        this.state = selected;
        this.onchange = onchange;
        this.elem = div({style: style});

        const svgDiv = div({
            style: {
                width: '14px',
                height: '14px',
                borderColor: 'gray',
                borderWidth: '1px',
                borderStyle: 'solid'
            }
        });
        this.svg = createIcon('check', (true === selected ? '#444' : 'transparent'));
        this.svg.style.width = '12px';
        this.svg.style.height = '12px';
        svgDiv.appendChild(this.svg);
        this.elem.appendChild(svgDiv);

        if (label) {
            const d = div({style: {marginLeft: '5px'}}); //{ class: 'igv-some-label-class' });
            d.textContent = label;
            this.elem.appendChild(d);
        }

        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !this.state;
            this.selected = newState;
            if (typeof this.onchange === 'function') {
                this.onchange(newState);
            }
        };
        this.elem.addEventListener('click', handleClick);
        this.elem.addEventListener('touchend', handleClick);
    }

    set selected(selected) {
        this.state = selected;
        const p = this.svg.querySelector('path');
        p.setAttributeNS(null, 'fill', (true === selected ? '#444' : 'transparent'));
    }

    get selected() {
        return this.state;
    }

    onchange(handler) {
        this.onchange = handler;
    }


}

function embedCSS() {

    var css =  '.igv-ui-popover {\n  cursor: default;\n  position: absolute;\n  z-index: 2048;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: 1px;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: small;\n  background-color: white; }\n  .igv-ui-popover > div:first-child {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    justify-content: space-between;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-popover > div:first-child > div:first-child {\n      margin-left: 4px; }\n    .igv-ui-popover > div:first-child > div:last-child {\n      margin-right: 4px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-popover > div:first-child > div:last-child:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-popover > div:last-child {\n    overflow-y: auto;\n    overflow-x: hidden;\n    max-height: 400px;\n    max-width: 1500px;\n    background-color: white; }\n    .igv-ui-popover > div:last-child > div {\n      -webkit-user-select: all;\n      /* Chrome/Safari */\n      -moz-user-select: all;\n      /* Firefox */\n      margin-left: 4px;\n      margin-right: 4px;\n      min-width: 220px;\n      overflow-x: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n      .igv-ui-popover > div:last-child > div > span {\n        font-weight: bolder; }\n    .igv-ui-popover > div:last-child hr {\n      width: 100%; }\n\n.igv-ui-alert-dialog-container {\n  box-sizing: content-box;\n  position: absolute;\n  z-index: 2048;\n  top: 50%;\n  left: 50%;\n  width: 400px;\n  height: 200px;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  outline: none;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 15px;\n  font-weight: 400;\n  background-color: white;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  align-items: center; }\n  .igv-ui-alert-dialog-container > div:first-child {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-alert-dialog-container > div:first-child div:first-child {\n      padding-left: 8px; }\n  .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body {\n    color: #373737;\n    width: 100%;\n    height: calc(100% - 24px - 64px);\n    overflow-y: scroll; }\n    .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body #igv-ui-alert-dialog-body-copy {\n      cursor: pointer;\n      margin: 16px;\n      width: auto;\n      height: auto;\n      overflow-wrap: break-word;\n      word-break: break-word;\n      background-color: white;\n      border: unset; }\n  .igv-ui-alert-dialog-container > div:last-child {\n    width: 100%;\n    margin-bottom: 10px;\n    background-color: white;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: center;\n    align-items: center; }\n    .igv-ui-alert-dialog-container > div:last-child div {\n      margin: unset;\n      width: 40px;\n      height: 30px;\n      line-height: 30px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: small;\n      font-weight: 400;\n      border-color: #2B81AF;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-alert-dialog-container > div:last-child div:hover {\n      cursor: pointer;\n      border-color: #25597f;\n      background-color: #25597f; }\n\n.igv-ui-color-swatch {\n  position: relative;\n  box-sizing: content-box;\n  display: flex;\n  flex-flow: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  width: 32px;\n  height: 32px;\n  border-style: solid;\n  border-width: 2px;\n  border-color: white;\n  border-radius: 4px; }\n\n.igv-ui-color-swatch:hover {\n  border-color: dimgray; }\n\n.igv-ui-colorpicker-menu-close-button {\n  display: flex;\n  flex-flow: row;\n  flex-wrap: nowrap;\n  justify-content: flex-end;\n  align-items: center;\n  width: 100%;\n  height: 32px;\n  margin-top: 4px;\n  margin-bottom: 4px;\n  padding-right: 8px; }\n  .igv-ui-colorpicker-menu-close-button i.fa {\n    display: block;\n    margin-left: 4px;\n    margin-right: 4px;\n    color: #5f5f5f; }\n  .igv-ui-colorpicker-menu-close-button i.fa:hover,\n  .igv-ui-colorpicker-menu-close-button i.fa:focus,\n  .igv-ui-colorpicker-menu-close-button i.fa:active {\n    cursor: pointer;\n    color: #0f0f0f; }\n\n.igv-ui-generic-dialog-container {\n  box-sizing: content-box;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 300px;\n  height: 200px;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  z-index: 2048;\n  background-color: white;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: center; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div {\n      margin-right: 4px;\n      margin-bottom: 2px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-one-liner {\n    color: #373737;\n    width: 95%;\n    height: 24px;\n    line-height: 24px;\n    text-align: left;\n    margin-top: 8px;\n    padding-left: 8px;\n    overflow-wrap: break-word;\n    background-color: white; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input {\n    margin-top: 8px;\n    width: 95%;\n    height: 24px;\n    color: #373737;\n    line-height: 24px;\n    padding-left: 8px;\n    background-color: white;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input div {\n      width: 30%;\n      height: 100%;\n      font-size: 16px;\n      text-align: right;\n      padding-right: 8px;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {\n      display: block;\n      height: 100%;\n      width: 100%;\n      padding-left: 4px;\n      font-family: \"Open Sans\", sans-serif;\n      font-weight: 400;\n      color: #373737;\n      text-align: left;\n      outline: none;\n      border-style: solid;\n      border-width: thin;\n      border-color: #7F7F7F;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {\n      width: 50%;\n      font-size: 16px; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input {\n    margin-top: 8px;\n    width: calc(100% - 16px);\n    height: 24px;\n    color: #373737;\n    line-height: 24px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {\n      display: block;\n      height: 100%;\n      width: 100%;\n      padding-left: 4px;\n      font-family: \"Open Sans\", sans-serif;\n      font-weight: 400;\n      color: #373737;\n      text-align: left;\n      outline: none;\n      border-style: solid;\n      border-width: thin;\n      border-color: #7F7F7F;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {\n      font-size: 16px; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel {\n    width: 100%;\n    height: 28px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div {\n      margin-top: 32px;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      width: 75px;\n      height: 28px;\n      line-height: 28px;\n      text-align: center;\n      border-color: transparent;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 2px; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:first-child {\n      margin-left: 32px;\n      margin-right: 0;\n      background-color: #5ea4e0; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:last-child {\n      margin-left: 0;\n      margin-right: 32px;\n      background-color: #c4c4c4; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:first-child:hover {\n      cursor: pointer;\n      background-color: #3b5c7f; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:last-child:hover {\n      cursor: pointer;\n      background-color: #7f7f7f; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok {\n    width: 100%;\n    height: 36px;\n    margin-top: 32px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok div {\n      width: 98px;\n      height: 36px;\n      line-height: 36px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: medium;\n      font-weight: 400;\n      border-color: white;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok div:hover {\n      cursor: pointer;\n      background-color: #25597f; }\n\n.igv-ui-generic-container {\n  box-sizing: content-box;\n  position: absolute;\n  z-index: 2048;\n  background-color: white;\n  cursor: pointer;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  align-items: center; }\n  .igv-ui-generic-container div:first-child {\n    cursor: move;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    height: 24px;\n    width: 100%;\n    background-color: #dddddd; }\n    .igv-ui-generic-container div:first-child div {\n      display: block;\n      color: #5f5f5f;\n      cursor: pointer;\n      width: 14px;\n      height: 14px;\n      margin-right: 8px;\n      margin-bottom: 4px; }\n\n.igv-ui-dialog {\n  z-index: 2048;\n  position: fixed;\n  width: fit-content;\n  height: fit-content;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  background-color: white;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400; }\n  .igv-ui-dialog .igv-ui-dialog-header {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-dialog .igv-ui-dialog-header div {\n      margin-right: 4px;\n      margin-bottom: 2px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-dialog .igv-ui-dialog-header div:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-dialog .igv-ui-dialog-one-liner {\n    width: 95%;\n    height: 24px;\n    line-height: 24px;\n    text-align: left;\n    margin: 8px;\n    overflow-wrap: break-word;\n    background-color: white;\n    font-weight: bold; }\n  .igv-ui-dialog .igv-ui-dialog-ok-cancel {\n    width: 100%;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div {\n      margin: 16px;\n      margin-top: 32px;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      width: 75px;\n      height: 28px;\n      line-height: 28px;\n      text-align: center;\n      border-color: transparent;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 2px; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child {\n      background-color: #5ea4e0; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child {\n      background-color: #c4c4c4; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child:hover {\n      cursor: pointer;\n      background-color: #3b5c7f; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child:hover {\n      cursor: pointer;\n      background-color: #7f7f7f; }\n  .igv-ui-dialog .igv-ui-dialog-ok {\n    width: 100%;\n    height: 36px;\n    margin-top: 32px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-dialog .igv-ui-dialog-ok div {\n      width: 98px;\n      height: 36px;\n      line-height: 36px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: medium;\n      font-weight: 400;\n      border-color: white;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-dialog .igv-ui-dialog-ok div:hover {\n      cursor: pointer;\n      background-color: #25597f; }\n\n.igv-ui-panel, .igv-ui-panel-column, .igv-ui-panel-row {\n  z-index: 2048;\n  background-color: white;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start; }\n\n.igv-ui-panel-column {\n  display: flex;\n  flex-direction: column; }\n\n.igv-ui-panel-row {\n  display: flex;\n  flex-direction: row; }\n\n.igv-ui-textbox {\n  background-color: white;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start; }\n\n/*# sourceMappingURL=igv-ui.css.map */\n';

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;

    document.head.insertBefore(style, document.head.childNodes[ document.head.childNodes.length - 1 ]);

}

if(typeof document !== 'undefined') {
    if (!stylesheetExists("igv-ui.css")) {
        // console.log('igv-ui. will call embedCSS() ...');
        embedCSS();
        // console.log('... done.');
    }
    function stylesheetExists(stylesheetName) {
        for (let ss of document.styleSheets) {
            ss = ss.href ? ss.href.replace(/^.*[\\\/]/, '') : '';
            if (ss === stylesheetName) {
                return true;
            }
        }
        return false;
    }
}

export { Alert, AlertDialog, alertSingleton as AlertSingleton, Checkbox, ColorPicker, DataRangeDialog, Dialog, GenericContainer, InputDialog, Panel, Popover, Textbox, createColorSwatchSelector };
