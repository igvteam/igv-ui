import DataRangeDialog from "./components/dataRangeDialog.js"
import AlertDialog from "./components/alertDialog.js"
import AlertSingleton from './alertSingleton.js'
import Alert from "./alert.js"
import InputDialog from "./components/inputDialog.js"
import SliderDialog from "./components/sliderDialog.js"
import Popover from "./popover.js"
import ColorPicker, {createColorSwatchSelector} from "./components/colorPicker.js"
import Checkbox from "./components/checkbox.js"
import Panel from "./components/panel.js"
import Textbox from "./components/textbox.js"
import Dialog from "./components/dialog.js"
import GenericContainer from "./genericContainer.js"
import GenericColorPicker from "./components/genericColorPicker.js"
import IGVTable from "./igvTable.js"
import embedCSS from "./embedCSS.js"

import * as Icon from './utils/icons.js'
import * as UIUtils from "./utils/ui-utils.js"
import * as DOMUtils from "./utils/dom-utils.js"
import makeDraggable from "./utils/draggable.js"
import {appleCrayonPalette, nucleotideColorComponents, nucleotideColors, PaletteColorTable} from './utils/colorPalettes.js'


if (typeof document !== 'undefined') {

    if (!stylesheetExists("igv-ui.css")) {
        embedCSS()
    }

    function stylesheetExists(stylesheetName) {
        for (let ss of document.styleSheets) {
            ss = ss.href ? ss.href.replace(/^.*[\\\/]/, '') : ''
            if (ss === stylesheetName) {
                return true
            }
        }
        return false
    }
}


export {
    DataRangeDialog,
    AlertDialog,
    AlertSingleton,
    Alert,
    InputDialog,
    SliderDialog,
    Popover,
    ColorPicker,
    createColorSwatchSelector,
    Checkbox,
    Panel,
    Textbox,
    Dialog,
    GenericContainer,
    GenericColorPicker,
    IGVTable,
    DOMUtils,
    UIUtils,
    Icon,
    makeDraggable,
    appleCrayonPalette,
    nucleotideColorComponents,
    nucleotideColors,
    PaletteColorTable,
}
