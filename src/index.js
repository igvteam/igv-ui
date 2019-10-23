import AlertDialog from "./alertDialog.js"
import InputDialog from "./inputDialog.js"
import Popover from "./popover.js"
import ColorPicker from "./colorPicker.js"
import embedCSS from "./embedCSS.js"


if(!stylesheetExists("igv-ui.css")) {
    embedCSS();
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


export {AlertDialog, InputDialog, Popover, ColorPicker}