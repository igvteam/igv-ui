import AlertDialog from "./alertDialog.js";
import Alert from "./alert.js";
import InputDialog from "./inputDialog.js"
import Popover from "./popover.js"
import ColorPicker, { createColorSwatchSelector } from "./colorPicker.js"
import Checkbox from "./components/checkbox.js";
import Panel from "./components/panel.js";
import Textbox from "./components/textbox.js"
import Dialog from "./components/dialog.js"
import GenericContainer from "./genericContainer.js"
import embedCSS from "./embedCSS.js"

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


export {
    AlertDialog,
    Alert,
    InputDialog,
    Popover,
    ColorPicker,
    createColorSwatchSelector,
    Checkbox,
    Panel,
    Textbox,
    Dialog,
    GenericContainer
}
