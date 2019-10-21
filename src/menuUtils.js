/**
 * Configure item list for track "gear" menu.
 * @param trackView
 */
import {hide, div} from "./dom-utils.js"


const MenuUtils = {

    /**
     *
     * items:  {label,  click}  or html string
     */
    trackMenuItemListHelper: function (itemList, popover) {

        let list;
        if (itemList.length > 0) {

            list = itemList.map(function (item, i) {
                let elem;
                if (typeof item === 'string') {
                    elem = div();
                    elem.innerHTML = item;
                } else if (typeof item === 'Node') {
                    elem = item;
                } else {
                    elem = div();
                    if(typeof item.label === 'string') {
                        elem.textContent = item.label;
                    }
                    if (item.click) {
                        elem.addEventListener('click', handleClick);
                        elem.addEventListener('touchend', function (e) {
                            handleClick(e);
                        });
                        elem.addEventListener('mouseup', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        })

                        // eslint-disable-next-line no-inner-declarations
                        function handleClick(e) {
                            item.click();
                            hide(popover);
                            e.preventDefault();
                            e.stopPropagation()
                        }
                    }
                }
                if (0 === i) {
                    elem.classList.add('igv-ui-track-menu-border-top');
                }
                elem.classList.add('igv-ui-')
                return {object: elem, init: (item.init || undefined)};
            })
        } else {
            list = [];
        }
        return list;
    }
}


export default MenuUtils;

