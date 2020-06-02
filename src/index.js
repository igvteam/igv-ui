import AlertDialog from "./alertDialog.js"
import InputDialog from "./inputDialog.js"
import Popover from "./popover.js"
import ColorPicker from "./colorPicker.js"
import Checkbox from "../src/components/checkbox.js";
import Panel from "../src/components/panel.js";
import Textbox from "../src/components/textbox.js"
import Dialog from "../src/components/dialog.js"
import GenericContainer from "./genericContainer.js"
import Alert from "./alert.js";
import * as DOMUtils from "./dom-utils.js"
import * as UIUtils from './ui-utils.js'
import * as Icon from "./icons.js"
import * as Color from './colorPalletes.js';
import makeDraggable from "./draggable.js"
import embedCSS from "./embedCSS.js"
import { createGenericSelectModal } from './genericSelectModal.js'
import { createTrackURLModal } from './trackURLModal.js'
import { createURLModal } from "./urlModal.js";
import { dropboxButtonImageBase64 } from "./createDropboxButtonImage.js";
import { googleDriveButtonImageBase64 } from "./createGoogleDriveButtonImage.js";

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


export {
    Alert,
    AlertDialog,
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
    makeDraggable,
    createURLModal,
    createGenericSelectModal,
    createTrackURLModal,
    dropboxButtonImageBase64,
    googleDriveButtonImageBase64
}
