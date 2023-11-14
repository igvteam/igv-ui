import Popover from "./popover.js"
import * as DOMUtils from "./utils/dom-utils.js"

class Dropdown {
    constructor(parent, shim) {
        this.dropdown = new Popover(parent, false, undefined)
        this.shim = shim
    }

    configure(dropdownItems) {
        this.dropdown.configure(dropdownItems)
    }

    present(event) {

        this.dropdown.popover.style.display = 'block'

        const parent = this.dropdown.popover.parentNode
        let { x, y, width } = DOMUtils.translateMouseCoordinates(event, parent)

        x += this.shim.left
        y += this.shim.top

        this.dropdown.popover.style.top  = `${ y }px`

        const { width: w } = this.dropdown.popover.getBoundingClientRect()

        const xmax = x + w
        const delta = xmax - width

        this.dropdown.popover.style.left = `${ xmax > width ? (x - delta) : x }px`
        this.dropdown.popoverContent.style.maxWidth = `${ Math.min(w, width) }px`
    }

    dismiss() {
        this.dropdown.dismiss()
    }
}

export default Dropdown
