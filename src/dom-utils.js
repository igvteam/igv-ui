
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

function hideAll(selector) {
    document.querySelectorAll(selector).forEach(elem => { hide(elem) });
}

function empty(elem) {
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
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

const relativeDOMBBox = (parentElement, childElement) => {
    const { x: x_p, y: y_p, width: width_p, height: height_p } = parentElement.getBoundingClientRect();
    const { x: x_c, y: y_c, width: width_c, height: height_c } = childElement.getBoundingClientRect();
    return { x: (x_c - x_p), y: (y_c - y_p), width: width_c, height:height_c };
};

function applyStyle(elem, style) {
    for (let key of Object.keys(style)) {
        elem.style[key] = style[key];
    }
}

function guid  () {
    return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
}

let getMouseXY = (domElement, event) => {

    const { clientX, clientY } = event;

    // a DOMRect object with eight properties:
    // left, top, right, bottom, x, y, width, height
    const { left, top, width, height } = domElement.getBoundingClientRect();

    return { x: clientX - left,  y: clientY - top, xNormalized: (clientX - left)/width, yNormalized: (clientY - top)/height };

};

/**
 * Translate the mouse coordinates for the event to the coordinates for the given target element
 * @param e
 * @param target
 * @returns {{x: number, y: number}}
 */
function translateMouseCoordinates(e, target) {

    const { x, y } = pageCoordinates(e);
    const { left, top } = offset(target);

    const xx = x - left;
    const yy = y - top;

    const { x: xxx, y: yyy } = getMouseXY(target, e);

    console.log(`legacy ${ xx } ${ yy } getMouse ${ xxx } ${ yyy }`);

    return { x: xx, y: yy }
}

export { create, div, hide, show, offset, hideAll, empty, pageCoordinates, relativeDOMBBox, applyStyle, guid, translateMouseCoordinates }
