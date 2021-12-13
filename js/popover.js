import * as Icon from '../node_modules/igv-utils/src/icons.js'
import * as UIUtils from "../node_modules/igv-utils/src/ui-utils.js"
import * as DOMUtils from "../node_modules/igv-utils/src/dom-utils.js"
import makeDraggable from "../node_modules/igv-utils/src/draggable.js"

import ColorPicker from "./components/colorPicker.js"

class Popover {

    constructor(parent, title) {

        this.parent = parent;

        // popover
        this.popover = DOMUtils.div({ class: "igv-ui-popover" })
        parent.appendChild(this.popover)

        // header
        const popoverHeader = DOMUtils.div();
        this.popover.appendChild(popoverHeader);

        const titleElement = DOMUtils.div();
        popoverHeader.appendChild(titleElement);
        if (title) {
            titleElement.textContent = title;
        }

        UIUtils.attachDialogCloseHandlerWithParent(popoverHeader,  () => this.hide())
        makeDraggable(this.popover, popoverHeader);

        // content
        this.popoverContent = DOMUtils.div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none'


    }

    presentContentWithEvent(e, content) {

        this.popover.style.display = 'block'

        this.popoverContent.innerHTML = content

        present(e, this.popover, this.popoverContent)

    }

    presentMenu(e, menuItems) {

        if (0 === menuItems.length) {
            return
        }

        this.popover.style.display = 'block'

        const menuElements = createMenuElements(menuItems, this.popover)
        for (let item of menuElements) {
            this.popoverContent.appendChild(item.object)
        }

        present(e, this.popover, this.popoverContent)
    }

    hide() {
        this.popover.style.display = 'none'
        this.dispose()
    }

    dispose() {

        if (this.popover) {
            this.popover.parentNode.removeChild(this.popover);
        }

        const keys = Object.keys(this)
        for (let key of keys) {
            this[ key ] = undefined
        }
    }

}

function present(e, popover, popoverContent) {

    const { x, y, width } = DOMUtils.translateMouseCoordinates(e, popover.parentNode)
    popover.style.top  = `${ y }px`

    const { width: w } = popover.getBoundingClientRect()

    const xmax = x + w
    const delta = xmax - width

    popover.style.left = `${ xmax > width ? (x - delta) : x }px`
    popoverContent.style.maxWidth = `${ Math.min(w, width) }px`


}

function createMenuElements(itemList, popover) {

    const list  = itemList.map(function (item, i) {
        let elem;

        if (typeof item === 'string') {
            elem = DOMUtils.div();
            elem.innerHTML = item;
        } else if (typeof item === 'Node') {
            elem = item;
        } else {
            if (typeof item.init === 'function') {
                item.init();
            }

            if ("checkbox" === item.type) {
                elem = Icon.createCheckbox("Show all bases", item.value);
            } else if("color" === item.type) {
                const colorPicker = new ColorPicker({
                    parent: popover.parentElement,
                    width: 364,
                    //defaultColor: 'aqua',
                    colorHandler: (color) => item.click(color)
                })
                elem = DOMUtils.div();
                if (typeof item.label === 'string') {
                    elem.innerHTML = item.label;
                }
                const clickHandler =  e => {
                    colorPicker.show();
                    DOMUtils.hide(popover);
                    e.preventDefault();
                    e.stopPropagation()
                }
                elem.addEventListener('click', clickHandler);
                elem.addEventListener('touchend', clickHandler);
                elem.addEventListener('mouseup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
            }

            else {
                elem = DOMUtils.div();
                if (typeof item.label === 'string') {
                    elem.innerHTML = item.label;
                }
            }

            if (item.click && "color" !== item.type) {
                elem.addEventListener('click', handleClick);
                elem.addEventListener('touchend', handleClick);
                elem.addEventListener('mouseup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                })

                // eslint-disable-next-line no-inner-declarations
                function handleClick(e) {
                    item.click();
                    DOMUtils.hide(popover);
                    e.preventDefault();
                    e.stopPropagation()
                }
            }
        }


        return { object: elem, init: item.init };
    })

    return list;
}

export default Popover;

