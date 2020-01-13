import GenericContainer from "./genericContainer.js"
import {createColorSwatchSelector} from "./ui-utils.js"

class ColorPicker extends GenericContainer {

    constructor({parent, top, left, width, height, defaultColor, colorHandler}) {
        super(
            {parent: parent,
                top: top,
                left: left,
                width: width || 364,
                border: "1px solid gray"})


        createColorSwatchSelector(this.container, colorHandler, defaultColor);
  }
}


export default ColorPicker