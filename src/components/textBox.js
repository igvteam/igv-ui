import {div} from "../dom-utils.js"

class Textbox {

    constructor(text) {
        this.elem = div();
        this.elem.innerHTML = text;
    }
}


export default Textbox