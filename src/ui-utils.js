import {createIcon} from "./bootstrap-icons.js";
//import {appleCrayonPalette} from "../util/colorPalletes.js"
//import IGVColor from "../igv-color.js"

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

// function createColorSwatchSelector($genericContainer, colorHandler, defaultColor) {
//
//     let appleColors = Object.values(appleCrayonPalette);
//
//     if (defaultColor && !(typeof defaultColor === 'function')) {
//
//         // Remove 'snow' color.
//         appleColors.splice(11, 1);
//
//         // Add default color.
//         appleColors.unshift(IGVColor.rgbToHex(defaultColor));
//     }
//
//     for (let color of appleColors) {
//
//         let $swatch = $('<div>', {class: 'igv-color-swatch'});
//         $genericContainer.append($swatch);
//
//         $swatch.css('background-color', color);
//
//         if ('white' === color) {
//             // do nothing
//             console.log('-');
//         } else {
//
//             $swatch.hover(() => {
//                     $swatch.get(0).style.borderColor = color;
//                 },
//                 () => {
//                     $swatch.get(0).style.borderColor = 'white';
//                 });
//
//             $swatch.on('click.trackview', (event) => {
//                 event.stopPropagation();
//                 colorHandler(color);
//             });
//
//             $swatch.on('touchend.trackview', (event) => {
//                 event.stopPropagation();
//                 colorHandler(color);
//             });
//
//         }
//
//     }
//
// }
//

export {attachDialogCloseHandlerWithParent}

