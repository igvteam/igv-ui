import * as DomUtils from '../dom-utils.js';


const rowStyle = {
    zIndex: 2048,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center'
}

const columnStyle = {
    zIndex: 2048,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
}

/**
 * Generic container for UI components
 */
class Panel {

    constructor() {

        this.elem = DomUtils.create('div', {
            class: 'igv-ui-panel-column'
        })
    }

    add(component) {
        this.elem.append(component.elem);
    }


}


export default Panel