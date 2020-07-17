import AlertDialog from "./alertDialog.js";
import Alert from "./alert.js";
import InputDialog from "./inputDialog.js"
import Popover from "./popover.js"
import ColorPicker from "./colorPicker.js"
import Checkbox from "../src/components/checkbox.js";
import Panel from "../src/components/panel.js";
import Textbox from "../src/components/textbox.js"
import Dialog from "../src/components/dialog.js"
import GenericContainer from "./genericContainer.js"
import * as DOMUtils from "./dom-utils.js"
import * as UIUtils from './ui-utils.js'
import * as Icon from "./icons.js"
import * as Color from './colorPalettes.js';
import makeDraggable from "./draggable.js"
import embedCSS from "./embedCSS.js"

if(!stylesheetExists("igv-ui.css")) {
    console.log('IGV-UI. Call embedCSS()');
    embedCSS();
} else {
    console.log('IGV-UI. Did not call embedCSS()');
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


export {
    AlertDialog,
    Alert,
    InputDialog,
    Popover,
    Color,
    ColorPicker,
    Checkbox,
    Panel,
    Textbox,
    Dialog,
    DOMUtils,
    UIUtils,
    Icon,
    GenericContainer,
    makeDraggable
}
