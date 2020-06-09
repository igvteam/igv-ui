import {createIcon} from "./icons.js";
import {appleCrayonPalette} from "./colorPalettes.js"
import {div} from "./dom-utils.js"
import makeDraggable from "./draggable.js"

function attachDialogCloseHandlerWithParent(parent, closeHandler) {

    var container = document.createElement("div");
    parent.appendChild(container);
    container.appendChild(createIcon("times"));
    container.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeHandler()
    });
}

function createColorSwatchSelector(container, colorHandler, defaultColors) {

    const appleColors = Object.values(appleCrayonPalette);

    for (let color of appleColors) {
        const swatch = div({ class: 'igv-ui-color-swatch' });
        container.appendChild(swatch);
        decorateSwatch(swatch, color, colorHandler)
    }

    if (defaultColors) {
        for (let color of defaultColors) {
            const swatch = div({ class: 'igv-ui-color-swatch' });
            container.appendChild(swatch);
            decorateSwatch(swatch, color, colorHandler)
        }
    }

}

const decorateSwatch = (swatch, color, colorHandler) => {

    swatch.style.backgroundColor = color;

    swatch.onmouseenter = () => swatch.style.borderColor = color;
    swatch.onmouseenter = () => swatch.style.borderColor = 'white';


    swatch.addEventListener('click', event => {
        event.stopPropagation();
        colorHandler(color);
    });

    swatch.addEventListener('touchend', event => {
        event.stopPropagation();
        colorHandler(color);
    });

}

function rgbToHex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}



export {attachDialogCloseHandlerWithParent, createColorSwatchSelector, makeDraggable}

