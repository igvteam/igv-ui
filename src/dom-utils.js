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
    }
    return elem;
}

function hide(elem) {
    const cssStyle = getComputedStyle(elem);
    elem._initialDisplay = cssStyle.display;
    elem.style.display = "none";
}

function show(elem) {
    const currentDisplay = getComputedStyle(elem).display;
    if (currentDisplay === "none") {
        const d = elem._initialDisplay || "block";
        elem.style.display = d;
    }
}

function offset(el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset !== undefined ? window.pageXOffset : document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

export {create, div, hide, show, offset}