import {appleCrayonPalette} from "./colorPalletes.js"
import GenericContainer from "./genericContainer.js"
import {div, show, hide} from "./dom-utils.js"

class ColorPicker extends GenericContainer {

    constructor({parent, top, left, width, height, defaultColor, colorHandler}) {
        super(
            {parent: parent,
                top: top,
                left: left,
                width: width || 364,
                border: "1px solid gray"})


        createColorSwatchSelector(this.container, colorHandler, defaultColor);
  }
}

function createColorSwatchSelector(container, colorHandler, defaultColor) {

    let appleColors = Object.values(appleCrayonPalette);

    if (defaultColor && !(typeof defaultColor === 'function')) {
        // Remove 'snow' color.
        appleColors.splice(11, 1);
        // Add default color.
        appleColors.unshift(rgbToHex(defaultColor));
    }

    for (let color of appleColors) {

        let swatch = div({class: 'igv-ui-color-swatch'});
        container.appendChild(swatch);

        swatch.style.backgroundColor = color;

        if ('white' === color) {
            // do nothing
            console.log('-');
        } else {

            swatch.onmouseenter = function(){
                this.style.borderColor = color;
            };

            swatch.onmouseleave = function(){
                this.style.borderColor = 'white'
            };

            swatch.addEventListener('click', (event) => {
                event.stopPropagation();
                colorHandler(color);
            });

            swatch.addEventListener('touchend', (event) => {
                event.stopPropagation();
                colorHandler(color);
            });

        }
    }
}

function rgbToHex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

export default ColorPicker