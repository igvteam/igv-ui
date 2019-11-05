import AlertDialog from "./alertDialog.js"
import InputDialog from "./inputDialog.js"
import Popover from "./popover.js"
import ColorPicker from "./colorPicker.js"
import Checkbox from "../src/components/checkbox.js";
import Panel from "../src/components/panel.js";
import Textbox from "../src/components/textbox.js"
import Dialog from "../src/components/dialog.js"
import * as DomUtils from "./dom-utils.js"
import * as Icon from "./bootstrap-icons.js"
import makeDraggable from "./draggable.js"
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


export {AlertDialog, InputDialog, Popover, ColorPicker, Checkbox, Panel, Textbox, Dialog, DomUtils, Icon, makeDraggable}