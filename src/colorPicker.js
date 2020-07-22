import { UIUtils } from '../node_modules/igv-utils/src/index.js'
import GenericContainer from "./genericContainer.js"

class ColorPicker extends GenericContainer {

    constructor({parent, top, left, width, height, defaultColor, colorHandler}) {

        super({ parent, top, left, width: (width || 364), height, border: '1px solid gray'})

        UIUtils.createColorSwatchSelector(this.container, colorHandler, defaultColor);
  }

}


export default ColorPicker
