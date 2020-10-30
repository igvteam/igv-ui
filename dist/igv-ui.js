function div(options) {
    return create("div", options);
}

function create(tag, options) {
    const elem = document.createElement(tag);
    if (options) {
        if (options.class) {
            elem.classList.add(options.class);
        }
        if (options.id) {
            elem.id = options.id;
        }
        if(options.style) {
            applyStyle(elem, options.style);
        }
    }
    return elem;
}

function hide(elem) {
    const cssStyle = getComputedStyle(elem);
    if(cssStyle.display !== "none") {
        elem._initialDisplay = cssStyle.display;
    }
    elem.style.display = "none";
}

function show(elem) {
    const currentDisplay = getComputedStyle(elem).display;
    if (currentDisplay === "none") {
        const d = elem._initialDisplay || "block";
        elem.style.display = d;
    }
}

function offset(elem) {
    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!elem.getClientRects().length) {
        return {top: 0, left: 0};
    }

    // Get document-relative position by adding viewport scroll to viewport-relative gBCR
    const rect = elem.getBoundingClientRect();
    const win = elem.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };
}

function pageCoordinates(e) {

    if (e.type.startsWith("touch")) {
        const touch = e.touches[0];
        return {x: touch.pageX, y: touch.pageY};
    } else {
        return {x: e.pageX, y: e.pageY}
    }
}

function applyStyle(elem, style) {
    for (let key of Object.keys(style)) {
        elem.style[key] = style[key];
    }
}

let getMouseXY = (domElement, { clientX, clientY }) => {

    // DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
    const { left, top, width, height } = domElement.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;
    return { x, y, xNormalized: x/width, yNormalized: y/height, width, height };

};

/**
 * Translate the mouse coordinates for the event to the coordinates for the given target element
 * @param event
 * @param domElement
 * @returns {{x: number, y: number}}
 */
function translateMouseCoordinates(event, domElement) {

    const { clientX, clientY } = event;
    return getMouseXY(domElement, { clientX, clientY });

}

function createCheckbox(name, initialState) {
    const container = div({class: 'igv-ui-trackgear-popover-check-container'});
    const svg = iconMarkup('check', (true === initialState ? '#444' : 'transparent'));
    svg.style.borderColor = 'gray';
    svg.style.borderWidth = '1px';
    svg.style.borderStyle = 'solid';

    container.appendChild(svg);
    let label = div(); //{ class: 'igv-some-label-class' });
    label.textContent = name;
    container.appendChild(label);

    return container;
}

function createIcon(name, color) {
    return iconMarkup(name, color);
}

function iconMarkup(name, color) {
    color = color || "currentColor";
    let icon = icons[name];
    if (!icon) {
        console.error(`No icon named: ${name}`);
        icon = icons["question"];
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null,'viewBox', '0 0 ' + icon[0] + ' ' + icon[1]);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null,'fill',  color );
    path.setAttributeNS(null,'d', icon[4]);
    svg.appendChild(path);
    return svg;
}

const icons = {
    "check": [512, 512, [], "f00c", "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"],
    "cog": [512, 512, [], "f013", "M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"],
    "exclamation": [192, 512, [], "f12a", "M176 432c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80zM25.26 25.199l13.6 272C39.499 309.972 50.041 320 62.83 320h66.34c12.789 0 23.331-10.028 23.97-22.801l13.6-272C167.425 11.49 156.496 0 142.77 0H49.23C35.504 0 24.575 11.49 25.26 25.199z"],
    "exclamation-circle": [512, 512, [], "f06a", "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"],
    "exclamation-triangle": [576, 512, [], "f071", "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"],
    "minus": [448, 512, [], "f068", "M424 318.2c13.3 0 24-10.7 24-24v-76.4c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h400z"],
    "minus-circle": [512, 512, [], "f056", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zM124 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H124z"],
    "minus-square": [448, 512, [], "f146", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM92 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H92z"],
    "plus": [448, 512, [], "f067", "M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"],
    "plus-circle": [512, 512, [], "f055", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"],
    "plus-square": [448, 512, [], "f0fe", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"],
    "question": [384, 512, [], "f128", "M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"],
    "save": [448, 512, [], "f0c7", "M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"],
    "search": [512, 512, [], "f002", "M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"],
    "share": [512, 512, [], "f064", "M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z"],
    "spinner": [512, 512, [], "f110", "M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"],
    "square": [448, 512, [], "f0c8", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"],
    "square-full": [512, 512, [], "f45c", "M512 512H0V0h512v512z"],
    "times": [384, 512, [], "f00d", "M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"],
    "times-circle": [512, 512, [], "f057", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"],
    "wrench": [512, 512, [], "f0ad", "M481.156 200c9.3 0 15.12 10.155 10.325 18.124C466.295 259.992 420.419 288 368 288c-79.222 0-143.501-63.974-143.997-143.079C223.505 65.469 288.548-.001 368.002 0c52.362.001 98.196 27.949 123.4 69.743C496.24 77.766 490.523 88 481.154 88H376l-40 56 40 56h105.156zm-171.649 93.003L109.255 493.255c-24.994 24.993-65.515 24.994-90.51 0-24.993-24.994-24.993-65.516 0-90.51L218.991 202.5c16.16 41.197 49.303 74.335 90.516 90.503zM104 432c0-13.255-10.745-24-24-24s-24 10.745-24 24 10.745 24 24 24 24-10.745 24-24z"],
};

function attachDialogCloseHandlerWithParent(parent, closeHandler) {

    var container = document.createElement("div");
    parent.appendChild(container);
    container.appendChild(createIcon("times"));
    container.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeHandler();
    });
}

/**
 * @fileoverview Zlib namespace. Zlib の仕様に準拠した圧縮は Zlib.Deflate で実装
 * されている. これは Inflate との共存を考慮している為.
 */
const ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE = 65000;

var Zlib = {
  Huffman: {},
  Util: {},
  CRC32: {}
};


/**
 * Compression Method
 * @enum {number}
 */
Zlib.CompressionMethod = {
  DEFLATE: 8,
  RESERVED: 15
};




/**
 * @param {Object=} opt_params options.
 * @constructor
 */
Zlib.Zip = function(opt_params) {
  opt_params = opt_params || {};
  /** @type {Array.<{
   *   buffer: !(Array.<number>|Uint8Array),
   *   option: Object,
   *   compressed: boolean,
   *   encrypted: boolean,
   *   size: number,
   *   crc32: number
   * }>} */
  this.files = [];
  /** @type {(Array.<number>|Uint8Array)} */
  this.comment = opt_params['comment'];
  /** @type {(Array.<number>|Uint8Array)} */
  this.password;
};


/**
 * @enum {number}
 */
Zlib.Zip.CompressionMethod = {
  STORE: 0,
  DEFLATE: 8
};

/**
 * @enum {number}
 */
Zlib.Zip.OperatingSystem = {
  MSDOS: 0,
  UNIX: 3,
  MACINTOSH: 7
};

/**
 * @enum {number}
 */
Zlib.Zip.Flags = {
  ENCRYPT:    0x0001,
  DESCRIPTOR: 0x0008,
  UTF8:       0x0800
};

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.FileHeaderSignature = [0x50, 0x4b, 0x01, 0x02];

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.LocalFileHeaderSignature = [0x50, 0x4b, 0x03, 0x04];

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.CentralDirectorySignature = [0x50, 0x4b, 0x05, 0x06];

/**
 * @param {Array.<number>|Uint8Array} input
 * @param {Object=} opt_params options.
 */
Zlib.Zip.prototype.addFile = function(input, opt_params) {
  opt_params = opt_params || {};
  /** @type {string} */
  var filename =  opt_params['filename'];
  /** @type {boolean} */
  var compressed;
  /** @type {number} */
  var size = input.length;
  /** @type {number} */
  var crc32 = 0;

  if ( input instanceof Array) {
    input = new Uint8Array(input);
  }

  // default
  if (typeof opt_params['compressionMethod'] !== 'number') {
    opt_params['compressionMethod'] = Zlib.Zip.CompressionMethod.DEFLATE;
  }

  // その場で圧縮する場合
  if (opt_params['compress']) {
    switch (opt_params['compressionMethod']) {
      case Zlib.Zip.CompressionMethod.STORE:
        break;
      case Zlib.Zip.CompressionMethod.DEFLATE:
        crc32 = Zlib.CRC32.calc(input);
        input = this.deflateWithOption(input, opt_params);
        compressed = true;
        break;
      default:
        throw new Error('unknown compression method:' + opt_params['compressionMethod']);
    }
  }

  this.files.push({
    buffer: input,
    option: opt_params,
    compressed: compressed,
    encrypted: false,
    size: size,
    crc32: crc32
  });
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 */
Zlib.Zip.prototype.setPassword = function(password) {
  this.password = password;
};

Zlib.Zip.prototype.compress = function() {
  /** @type {Array.<{
   *   buffer: !(Array.<number>|Uint8Array),
   *   option: Object,
   *   compressed: boolean,
   *   encrypted: boolean,
   *   size: number,
   *   crc32: number
   * }>} */
  var files = this.files;
  /** @type {{
   *   buffer: !(Array.<number>|Uint8Array),
   *   option: Object,
   *   compressed: boolean,
   *   encrypted: boolean,
   *   size: number,
   *   crc32: number
   * }} */
  var file;
  /** @type {!(Array.<number>|Uint8Array)} */
  var output;
  /** @type {number} */
  var op1;
  /** @type {number} */
  var op2;
  /** @type {number} */
  var op3;
  /** @type {number} */
  var localFileSize = 0;
  /** @type {number} */
  var centralDirectorySize = 0;
  /** @type {number} */
  var endOfCentralDirectorySize;
  /** @type {number} */
  var offset;
  /** @type {number} */
  var needVersion;
  /** @type {number} */
  var flags;
  /** @type {Zlib.Zip.CompressionMethod} */
  var compressionMethod;
  /** @type {Date} */
  var date;
  /** @type {number} */
  var crc32;
  /** @type {number} */
  var size;
  /** @type {number} */
  var plainSize;
  /** @type {number} */
  var filenameLength;
  /** @type {number} */
  var extraFieldLength;
  /** @type {number} */
  var commentLength;
  /** @type {(Array.<number>|Uint8Array)} */
  var filename;
  /** @type {(Array.<number>|Uint8Array)} */
  var extraField;
  /** @type {(Array.<number>|Uint8Array)} */
  var comment;
  /** @type {(Array.<number>|Uint8Array)} */
  var buffer;
  /** @type {*} */
  var tmp;
  /** @type {Array.<number>|Uint32Array|Object} */
  var key;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {number} */
  var j;
  /** @type {number} */
  var jl;

  // ファイルの圧縮
  for (i = 0, il = files.length; i < il; ++i) {
    file = files[i];
    filenameLength =
        (file.option['filename']) ? file.option['filename'].length : 0;
    extraFieldLength =
        (file.option['extraField']) ? file.option['extraField'].length : 0;
    commentLength =
        (file.option['comment']) ? file.option['comment'].length : 0;

    // 圧縮されていなかったら圧縮
    if (!file.compressed) {
      // 圧縮前に CRC32 の計算をしておく
      file.crc32 = Zlib.CRC32.calc(file.buffer);

      switch (file.option['compressionMethod']) {
        case Zlib.Zip.CompressionMethod.STORE:
          break;
        case Zlib.Zip.CompressionMethod.DEFLATE:
          file.buffer = this.deflateWithOption(file.buffer, file.option);
          file.compressed = true;
          break;
        default:
          throw new Error('unknown compression method:' + file.option['compressionMethod']);
      }
    }

    // encryption
    if (file.option['password'] !== void 0|| this.password !== void 0) {
      // init encryption
      key = this.createEncryptionKey(file.option['password'] || this.password);

      // add header
      buffer = file.buffer;
      {
        tmp = new Uint8Array(buffer.length + 12);
        tmp.set(buffer, 12);
        buffer = tmp;
      }

      for (j = 0; j < 12; ++j) {
        buffer[j] = this.encode(
            key,
            i === 11 ? (file.crc32 & 0xff) : (Math.random() * 256 | 0)
        );
      }

      // data encryption
      for (jl = buffer.length; j < jl; ++j) {
        buffer[j] = this.encode(key, buffer[j]);
      }
      file.buffer = buffer;
    }

    // 必要バッファサイズの計算
    localFileSize +=
        // local file header
        30 + filenameLength +
        // file data
        file.buffer.length;

    centralDirectorySize +=
        // file header
        46 + filenameLength + commentLength;
  }

  // end of central directory
  endOfCentralDirectorySize = 22 + (this.comment ? this.comment.length : 0);
  output = new ( Uint8Array )(
      localFileSize + centralDirectorySize + endOfCentralDirectorySize
  );
  op1 = 0;
  op2 = localFileSize;
  op3 = op2 + centralDirectorySize;

  // ファイルの圧縮
  for (i = 0, il = files.length; i < il; ++i) {
    file = files[i];
    filenameLength =
        file.option['filename'] ? file.option['filename'].length :  0;
    extraFieldLength = 0; // TODO
    commentLength =
        file.option['comment'] ? file.option['comment'].length : 0;

    //-------------------------------------------------------------------------
    // local file header & file header
    //-------------------------------------------------------------------------

    offset = op1;

    // signature
    // local file header
    output[op1++] = Zlib.Zip.LocalFileHeaderSignature[0];
    output[op1++] = Zlib.Zip.LocalFileHeaderSignature[1];
    output[op1++] = Zlib.Zip.LocalFileHeaderSignature[2];
    output[op1++] = Zlib.Zip.LocalFileHeaderSignature[3];
    // file header
    output[op2++] = Zlib.Zip.FileHeaderSignature[0];
    output[op2++] = Zlib.Zip.FileHeaderSignature[1];
    output[op2++] = Zlib.Zip.FileHeaderSignature[2];
    output[op2++] = Zlib.Zip.FileHeaderSignature[3];

    // compressor info
    needVersion = 20;
    output[op2++] = needVersion & 0xff;
    output[op2++] =
        /** @type {Zlib.Zip.OperatingSystem} */
        (file.option['os']) ||
        Zlib.Zip.OperatingSystem.MSDOS;

    // need version
    output[op1++] = output[op2++] =  needVersion       & 0xff;
    output[op1++] = output[op2++] = (needVersion >> 8) & 0xff;

    // general purpose bit flag
    flags = 0;
    if (file.option['password'] || this.password) {
      flags |= Zlib.Zip.Flags.ENCRYPT;
    }
    output[op1++] = output[op2++] =  flags       & 0xff;
    output[op1++] = output[op2++] = (flags >> 8) & 0xff;

    // compression method
    compressionMethod =
        /** @type {Zlib.Zip.CompressionMethod} */
        (file.option['compressionMethod']);
    output[op1++] = output[op2++] =  compressionMethod       & 0xff;
    output[op1++] = output[op2++] = (compressionMethod >> 8) & 0xff;

    // date
    date = /** @type {(Date|undefined)} */(file.option['date']) || new Date();
    output[op1++] = output[op2++] =
        ((date.getMinutes() & 0x7) << 5) |
        (date.getSeconds() / 2 | 0);
    output[op1++] = output[op2++] =
        (date.getHours()   << 3) |
        (date.getMinutes() >> 3);
    //
    output[op1++] = output[op2++] =
        ((date.getMonth() + 1 & 0x7) << 5) |
        (date.getDate());
    output[op1++] = output[op2++] =
        ((date.getFullYear() - 1980 & 0x7f) << 1) |
        (date.getMonth() + 1 >> 3);

    // CRC-32
    crc32 = file.crc32;
    output[op1++] = output[op2++] =  crc32        & 0xff;
    output[op1++] = output[op2++] = (crc32 >>  8) & 0xff;
    output[op1++] = output[op2++] = (crc32 >> 16) & 0xff;
    output[op1++] = output[op2++] = (crc32 >> 24) & 0xff;

    // compressed size
    size = file.buffer.length;
    output[op1++] = output[op2++] =  size        & 0xff;
    output[op1++] = output[op2++] = (size >>  8) & 0xff;
    output[op1++] = output[op2++] = (size >> 16) & 0xff;
    output[op1++] = output[op2++] = (size >> 24) & 0xff;

    // uncompressed size
    plainSize = file.size;
    output[op1++] = output[op2++] =  plainSize        & 0xff;
    output[op1++] = output[op2++] = (plainSize >>  8) & 0xff;
    output[op1++] = output[op2++] = (plainSize >> 16) & 0xff;
    output[op1++] = output[op2++] = (plainSize >> 24) & 0xff;

    // filename length
    output[op1++] = output[op2++] =  filenameLength       & 0xff;
    output[op1++] = output[op2++] = (filenameLength >> 8) & 0xff;

    // extra field length
    output[op1++] = output[op2++] =  extraFieldLength       & 0xff;
    output[op1++] = output[op2++] = (extraFieldLength >> 8) & 0xff;

    // file comment length
    output[op2++] =  commentLength       & 0xff;
    output[op2++] = (commentLength >> 8) & 0xff;

    // disk number start
    output[op2++] = 0;
    output[op2++] = 0;

    // internal file attributes
    output[op2++] = 0;
    output[op2++] = 0;

    // external file attributes
    output[op2++] = 0;
    output[op2++] = 0;
    output[op2++] = 0;
    output[op2++] = 0;

    // relative offset of local header
    output[op2++] =  offset        & 0xff;
    output[op2++] = (offset >>  8) & 0xff;
    output[op2++] = (offset >> 16) & 0xff;
    output[op2++] = (offset >> 24) & 0xff;

    // filename
    filename = file.option['filename'];
    if (filename) {
      {
        output.set(filename, op1);
        output.set(filename, op2);
        op1 += filenameLength;
        op2 += filenameLength;
      }
    }

    // extra field
    extraField = file.option['extraField'];
    if (extraField) {
      {
        output.set(extraField, op1);
        output.set(extraField, op2);
        op1 += extraFieldLength;
        op2 += extraFieldLength;
      }
    }

    // comment
    comment = file.option['comment'];
    if (comment) {
      {
        output.set(comment, op2);
        op2 += commentLength;
      }
    }

    //-------------------------------------------------------------------------
    // file data
    //-------------------------------------------------------------------------

    {
      output.set(file.buffer, op1);
      op1 += file.buffer.length;
    }
  }

  //-------------------------------------------------------------------------
  // end of central directory
  //-------------------------------------------------------------------------

  // signature
  output[op3++] = Zlib.Zip.CentralDirectorySignature[0];
  output[op3++] = Zlib.Zip.CentralDirectorySignature[1];
  output[op3++] = Zlib.Zip.CentralDirectorySignature[2];
  output[op3++] = Zlib.Zip.CentralDirectorySignature[3];

  // number of this disk
  output[op3++] = 0;
  output[op3++] = 0;

  // number of the disk with the start of the central directory
  output[op3++] = 0;
  output[op3++] = 0;

  // total number of entries in the central directory on this disk
  output[op3++] =  il       & 0xff;
  output[op3++] = (il >> 8) & 0xff;

  // total number of entries in the central directory
  output[op3++] =  il       & 0xff;
  output[op3++] = (il >> 8) & 0xff;

  // size of the central directory
  output[op3++] =  centralDirectorySize        & 0xff;
  output[op3++] = (centralDirectorySize >>  8) & 0xff;
  output[op3++] = (centralDirectorySize >> 16) & 0xff;
  output[op3++] = (centralDirectorySize >> 24) & 0xff;

  // offset of start of central directory with respect to the starting disk number
  output[op3++] =  localFileSize        & 0xff;
  output[op3++] = (localFileSize >>  8) & 0xff;
  output[op3++] = (localFileSize >> 16) & 0xff;
  output[op3++] = (localFileSize >> 24) & 0xff;

  // .ZIP file comment length
  commentLength = this.comment ? this.comment.length : 0;
  output[op3++] =  commentLength       & 0xff;
  output[op3++] = (commentLength >> 8) & 0xff;

  // .ZIP file comment
  if (this.comment) {
    {
      output.set(this.comment, op3);
      op3 += commentLength;
    }
  }

  return output;
};

/**
 * @param {!(Array.<number>|Uint8Array)} input
 * @param {Object=} opt_params options.
 * @return {!(Array.<number>|Uint8Array)}
 */
Zlib.Zip.prototype.deflateWithOption = function(input, opt_params) {
  /** @type {Zlib.RawDeflate} */
  var deflator = new Zlib.RawDeflate(input, opt_params['deflateOption']);

  return deflator.compress();
};

/**
 * @param {(Array.<number>|Uint32Array)} key
 * @return {number}
 */
Zlib.Zip.prototype.getByte = function(key) {
  /** @type {number} */
  var tmp = ((key[2] & 0xffff) | 2);

  return ((tmp * (tmp ^ 1)) >> 8) & 0xff;
};

/**
 * @param {(Array.<number>|Uint32Array|Object)} key
 * @param {number} n
 * @return {number}
 */
Zlib.Zip.prototype.encode = function(key, n) {
  /** @type {number} */
  var tmp = this.getByte(/** @type {(Array.<number>|Uint32Array)} */(key));

  this.updateKeys(/** @type {(Array.<number>|Uint32Array)} */(key), n);

  return tmp ^ n;
};

/**
 * @param {(Array.<number>|Uint32Array)} key
 * @param {number} n
 */
Zlib.Zip.prototype.updateKeys = function(key, n) {
  key[0] = Zlib.CRC32.single(key[0], n);
  key[1] =
      (((((key[1] + (key[0] & 0xff)) * 20173 >>> 0) * 6681) >>> 0) + 1) >>> 0;
  key[2] = Zlib.CRC32.single(key[2], key[1] >>> 24);
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 * @return {!(Array.<number>|Uint32Array|Object)}
 */
Zlib.Zip.prototype.createEncryptionKey = function(password) {
  /** @type {!(Array.<number>|Uint32Array)} */
  var key = [305419896, 591751049, 878082192];
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  {
    key = new Uint32Array(key);
  }

  for (i = 0, il = password.length; i < il; ++i) {
    this.updateKeys(key, password[i] & 0xff);
  }

  return key;
};



/**
 * build huffman table from length list.
 * @param {!(Array.<number>|Uint8Array)} lengths length list.
 * @return {!Array} huffman table.
 */
Zlib.Huffman.buildHuffmanTable = function(lengths) {
  /** @type {number} length list size. */
  var listSize = lengths.length;
  /** @type {number} max code length for table size. */
  var maxCodeLength = 0;
  /** @type {number} min code length for table size. */
  var minCodeLength = Number.POSITIVE_INFINITY;
  /** @type {number} table size. */
  var size;
  /** @type {!(Array|Uint8Array)} huffman code table. */
  var table;
  /** @type {number} bit length. */
  var bitLength;
  /** @type {number} huffman code. */
  var code;
  /**
   * サイズが 2^maxlength 個のテーブルを埋めるためのスキップ長.
   * @type {number} skip length for table filling.
   */
  var skip;
  /** @type {number} reversed code. */
  var reversed;
  /** @type {number} reverse temp. */
  var rtemp;
  /** @type {number} loop counter. */
  var i;
  /** @type {number} loop limit. */
  var il;
  /** @type {number} loop counter. */
  var j;
  /** @type {number} table value. */
  var value;

  // Math.max は遅いので最長の値は for-loop で取得する
  for (i = 0, il = listSize; i < il; ++i) {
    if (lengths[i] > maxCodeLength) {
      maxCodeLength = lengths[i];
    }
    if (lengths[i] < minCodeLength) {
      minCodeLength = lengths[i];
    }
  }

  size = 1 << maxCodeLength;
  table = new ( Uint32Array )(size);

  // ビット長の短い順からハフマン符号を割り当てる
  for (bitLength = 1, code = 0, skip = 2; bitLength <= maxCodeLength;) {
    for (i = 0; i < listSize; ++i) {
      if (lengths[i] === bitLength) {
        // ビットオーダーが逆になるためビット長分並びを反転する
        for (reversed = 0, rtemp = code, j = 0; j < bitLength; ++j) {
          reversed = (reversed << 1) | (rtemp & 1);
          rtemp >>= 1;
        }

        // 最大ビット長をもとにテーブルを作るため、
        // 最大ビット長以外では 0 / 1 どちらでも良い箇所ができる
        // そのどちらでも良い場所は同じ値で埋めることで
        // 本来のビット長以上のビット数取得しても問題が起こらないようにする
        value = (bitLength << 16) | i;
        for (j = reversed; j < size; j += skip) {
          table[j] = value;
        }

        ++code;
      }
    }

    // 次のビット長へ
    ++bitLength;
    code <<= 1;
    skip <<= 1;
  }

  return [table, maxCodeLength, minCodeLength];
};




//-----------------------------------------------------------------------------

/** @define {number} buffer block size. */
var ZLIB_RAW_INFLATE_BUFFER_SIZE = 0x8000; // [ 0x8000 >= ZLIB_BUFFER_BLOCK_SIZE ]

//-----------------------------------------------------------------------------


var buildHuffmanTable = Zlib.Huffman.buildHuffmanTable;

/**
 * @constructor
 * @param {!(Uint8Array|Array.<number>)} input input buffer.
 * @param {Object} opt_params option parameter.
 *
 * opt_params は以下のプロパティを指定する事ができます。
 *   - index: input buffer の deflate コンテナの開始位置.
 *   - blockSize: バッファのブロックサイズ.
 *   - bufferType: Zlib.RawInflate.BufferType の値によってバッファの管理方法を指定する.
 *   - resize: 確保したバッファが実際の大きさより大きかった場合に切り詰める.
 */
Zlib.RawInflate = function(input, opt_params) {
  /** @type {!(Array.<number>|Uint8Array)} inflated buffer */
  this.buffer;
  /** @type {!Array.<(Array.<number>|Uint8Array)>} */
  this.blocks = [];
  /** @type {number} block size. */
  this.bufferSize = ZLIB_RAW_INFLATE_BUFFER_SIZE;
  /** @type {!number} total output buffer pointer. */
  this.totalpos = 0;
  /** @type {!number} input buffer pointer. */
  this.ip = 0;
  /** @type {!number} bit stream reader buffer. */
  this.bitsbuf = 0;
  /** @type {!number} bit stream reader buffer size. */
  this.bitsbuflen = 0;
  /** @type {!(Array.<number>|Uint8Array)} input buffer. */
  this.input =  new Uint8Array(input) ;
  /** @type {!(Uint8Array|Array.<number>)} output buffer. */
  this.output;
  /** @type {!number} output buffer pointer. */
  this.op;
  /** @type {boolean} is final block flag. */
  this.bfinal = false;
  /** @type {Zlib.RawInflate.BufferType} buffer management. */
  this.bufferType = Zlib.RawInflate.BufferType.ADAPTIVE;
  /** @type {boolean} resize flag for memory size optimization. */
  this.resize = false;

  // option parameters
  if (opt_params || !(opt_params = {})) {
    if (opt_params['index']) {
      this.ip = opt_params['index'];
    }
    if (opt_params['bufferSize']) {
      this.bufferSize = opt_params['bufferSize'];
    }
    if (opt_params['bufferType']) {
      this.bufferType = opt_params['bufferType'];
    }
    if (opt_params['resize']) {
      this.resize = opt_params['resize'];
    }
  }

  // initialize
  switch (this.bufferType) {
    case Zlib.RawInflate.BufferType.BLOCK:
      this.op = Zlib.RawInflate.MaxBackwardLength;
      this.output =
          new ( Uint8Array )(
              Zlib.RawInflate.MaxBackwardLength +
              this.bufferSize +
              Zlib.RawInflate.MaxCopyLength
          );
      break;
    case Zlib.RawInflate.BufferType.ADAPTIVE:
      this.op = 0;
      this.output = new ( Uint8Array )(this.bufferSize);
      break;
    default:
      throw new Error('invalid inflate mode');
  }
};

/**
 * @enum {number}
 */
Zlib.RawInflate.BufferType = {
  BLOCK: 0,
  ADAPTIVE: 1
};

/**
 * decompress.
 * @return {!(Uint8Array|Array.<number>)} inflated buffer.
 */
Zlib.RawInflate.prototype.decompress = function() {
  while (!this.bfinal) {
    this.parseBlock();
  }

  switch (this.bufferType) {
    case Zlib.RawInflate.BufferType.BLOCK:
      return this.concatBufferBlock();
    case Zlib.RawInflate.BufferType.ADAPTIVE:
      return this.concatBufferDynamic();
    default:
      throw new Error('invalid inflate mode');
  }
};

/**
 * @const
 * @type {number} max backward length for LZ77.
 */
Zlib.RawInflate.MaxBackwardLength = 32768;

/**
 * @const
 * @type {number} max copy length for LZ77.
 */
Zlib.RawInflate.MaxCopyLength = 258;

/**
 * huffman order
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.Order = (function(table) {
  return  new Uint16Array(table) ;
})([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

/**
 * huffman length code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflate.LengthCodeTable = (function(table) {
  return  new Uint16Array(table) ;
})([
  0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009, 0x000a, 0x000b,
  0x000d, 0x000f, 0x0011, 0x0013, 0x0017, 0x001b, 0x001f, 0x0023, 0x002b,
  0x0033, 0x003b, 0x0043, 0x0053, 0x0063, 0x0073, 0x0083, 0x00a3, 0x00c3,
  0x00e3, 0x0102, 0x0102, 0x0102
]);

/**
 * huffman length extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.LengthExtraTable = (function(table) {
  return  new Uint8Array(table) ;
})([
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
  5, 5, 0, 0, 0
]);

/**
 * huffman dist code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflate.DistCodeTable = (function(table) {
  return  new Uint16Array(table) ;
})([
  0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d, 0x0011,
  0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1, 0x0101, 0x0181,
  0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01, 0x1001, 0x1801, 0x2001,
  0x3001, 0x4001, 0x6001
]);

/**
 * huffman dist extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.DistExtraTable = (function(table) {
  return  new Uint8Array(table) ;
})([
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
  11, 12, 12, 13, 13
]);

/**
 * fixed huffman length code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflate.FixedLiteralLengthTable = (function(table) {
  return table;
})((function() {
  var lengths = new ( Uint8Array )(288);
  var i, il;

  for (i = 0, il = lengths.length; i < il; ++i) {
    lengths[i] =
        (i <= 143) ? 8 :
            (i <= 255) ? 9 :
                (i <= 279) ? 7 :
                    8;
  }

  return buildHuffmanTable(lengths);
})());

/**
 * fixed huffman distance code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflate.FixedDistanceTable = (function(table) {
  return table;
})((function() {
  var lengths = new ( Uint8Array )(30);
  var i, il;

  for (i = 0, il = lengths.length; i < il; ++i) {
    lengths[i] = 5;
  }

  return buildHuffmanTable(lengths);
})());

/**
 * parse deflated block.
 */
Zlib.RawInflate.prototype.parseBlock = function() {
  /** @type {number} header */
  var hdr = this.readBits(3);

  // BFINAL
  if (hdr & 0x1) {
    this.bfinal = true;
  }

  // BTYPE
  hdr >>>= 1;
  switch (hdr) {
      // uncompressed
    case 0:
      this.parseUncompressedBlock();
      break;
      // fixed huffman
    case 1:
      this.parseFixedHuffmanBlock();
      break;
      // dynamic huffman
    case 2:
      this.parseDynamicHuffmanBlock();
      break;
      // reserved or other
    default:
      throw new Error('unknown BTYPE: ' + hdr);
  }
};

/**
 * read inflate bits
 * @param {number} length bits length.
 * @return {number} read bits.
 */
Zlib.RawInflate.prototype.readBits = function(length) {
  var bitsbuf = this.bitsbuf;
  var bitsbuflen = this.bitsbuflen;
  var input = this.input;
  var ip = this.ip;

  /** @type {number} */
  var inputLength = input.length;
  /** @type {number} input and output byte. */
  var octet;

  // input byte
  if (ip + ((length - bitsbuflen + 7) >> 3) >= inputLength) {
    throw new Error('input buffer is broken');
  }

  // not enough buffer
  while (bitsbuflen < length) {
    bitsbuf |= input[ip++] << bitsbuflen;
    bitsbuflen += 8;
  }

  // output byte
  octet = bitsbuf & /* MASK */ ((1 << length) - 1);
  bitsbuf >>>= length;
  bitsbuflen -= length;

  this.bitsbuf = bitsbuf;
  this.bitsbuflen = bitsbuflen;
  this.ip = ip;

  return octet;
};

/**
 * read huffman code using table
 * @param {!(Array.<number>|Uint8Array|Uint16Array)} table huffman code table.
 * @return {number} huffman code.
 */
Zlib.RawInflate.prototype.readCodeByTable = function(table) {
  var bitsbuf = this.bitsbuf;
  var bitsbuflen = this.bitsbuflen;
  var input = this.input;
  var ip = this.ip;

  /** @type {number} */
  var inputLength = input.length;
  /** @type {!(Array.<number>|Uint8Array)} huffman code table */
  var codeTable = table[0];
  /** @type {number} */
  var maxCodeLength = table[1];
  /** @type {number} code length & code (16bit, 16bit) */
  var codeWithLength;
  /** @type {number} code bits length */
  var codeLength;

  // not enough buffer
  while (bitsbuflen < maxCodeLength) {
    if (ip >= inputLength) {
      break;
    }
    bitsbuf |= input[ip++] << bitsbuflen;
    bitsbuflen += 8;
  }

  // read max length
  codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
  codeLength = codeWithLength >>> 16;

  if (codeLength > bitsbuflen) {
    throw new Error('invalid code length: ' + codeLength);
  }

  this.bitsbuf = bitsbuf >> codeLength;
  this.bitsbuflen = bitsbuflen - codeLength;
  this.ip = ip;

  return codeWithLength & 0xffff;
};

/**
 * parse uncompressed block.
 */
Zlib.RawInflate.prototype.parseUncompressedBlock = function() {
  var input = this.input;
  var ip = this.ip;
  var output = this.output;
  var op = this.op;

  /** @type {number} */
  var inputLength = input.length;
  /** @type {number} block length */
  var len;
  /** @type {number} number for check block length */
  var nlen;
  /** @type {number} output buffer length */
  var olength = output.length;
  /** @type {number} copy counter */
  var preCopy;

  // skip buffered header bits
  this.bitsbuf = 0;
  this.bitsbuflen = 0;

  // len
  if (ip + 1 >= inputLength) {
    throw new Error('invalid uncompressed block header: LEN');
  }
  len = input[ip++] | (input[ip++] << 8);

  // nlen
  if (ip + 1 >= inputLength) {
    throw new Error('invalid uncompressed block header: NLEN');
  }
  nlen = input[ip++] | (input[ip++] << 8);

  // check len & nlen
  if (len === ~nlen) {
    throw new Error('invalid uncompressed block header: length verify');
  }

  // check size
  if (ip + len > input.length) { throw new Error('input buffer is broken'); }

  // expand buffer
  switch (this.bufferType) {
    case Zlib.RawInflate.BufferType.BLOCK:
      // pre copy
      while (op + len > output.length) {
        preCopy = olength - op;
        len -= preCopy;
        {
          output.set(input.subarray(ip, ip + preCopy), op);
          op += preCopy;
          ip += preCopy;
        }
        this.op = op;
        output = this.expandBufferBlock();
        op = this.op;
      }
      break;
    case Zlib.RawInflate.BufferType.ADAPTIVE:
      while (op + len > output.length) {
        output = this.expandBufferAdaptive({fixRatio: 2});
      }
      break;
    default:
      throw new Error('invalid inflate mode');
  }

  // copy
  {
    output.set(input.subarray(ip, ip + len), op);
    op += len;
    ip += len;
  }

  this.ip = ip;
  this.op = op;
  this.output = output;
};

/**
 * parse fixed huffman block.
 */
Zlib.RawInflate.prototype.parseFixedHuffmanBlock = function() {
  switch (this.bufferType) {
    case Zlib.RawInflate.BufferType.ADAPTIVE:
      this.decodeHuffmanAdaptive(
          Zlib.RawInflate.FixedLiteralLengthTable,
          Zlib.RawInflate.FixedDistanceTable
      );
      break;
    case Zlib.RawInflate.BufferType.BLOCK:
      this.decodeHuffmanBlock(
          Zlib.RawInflate.FixedLiteralLengthTable,
          Zlib.RawInflate.FixedDistanceTable
      );
      break;
    default:
      throw new Error('invalid inflate mode');
  }
};

/**
 * parse dynamic huffman block.
 */
Zlib.RawInflate.prototype.parseDynamicHuffmanBlock = function() {
  /** @type {number} number of literal and length codes. */
  var hlit = this.readBits(5) + 257;
  /** @type {number} number of distance codes. */
  var hdist = this.readBits(5) + 1;
  /** @type {number} number of code lengths. */
  var hclen = this.readBits(4) + 4;
  /** @type {!(Uint8Array|Array.<number>)} code lengths. */
  var codeLengths =
      new ( Uint8Array )(Zlib.RawInflate.Order.length);
  /** @type {!Array} code lengths table. */
  var codeLengthsTable;
  /** @type {!(Uint8Array|Array.<number>)} literal and length code table. */
  var litlenTable;
  /** @type {!(Uint8Array|Array.<number>)} distance code table. */
  var distTable;
  /** @type {!(Uint8Array|Array.<number>)} code length table. */
  var lengthTable;
  /** @type {number} */
  var code;
  /** @type {number} */
  var prev;
  /** @type {number} */
  var repeat;
  /** @type {number} loop counter. */
  var i;
  /** @type {number} loop limit. */
  var il;

  // decode code lengths
  for (i = 0; i < hclen; ++i) {
    codeLengths[Zlib.RawInflate.Order[i]] = this.readBits(3);
  }

  // decode length table
  codeLengthsTable = buildHuffmanTable(codeLengths);
  lengthTable = new ( Uint8Array )(hlit + hdist);
  for (i = 0, il = hlit + hdist; i < il;) {
    code = this.readCodeByTable(codeLengthsTable);
    switch (code) {
      case 16:
        repeat = 3 + this.readBits(2);
        while (repeat--) { lengthTable[i++] = prev; }
        break;
      case 17:
        repeat = 3 + this.readBits(3);
        while (repeat--) { lengthTable[i++] = 0; }
        prev = 0;
        break;
      case 18:
        repeat = 11 + this.readBits(7);
        while (repeat--) { lengthTable[i++] = 0; }
        prev = 0;
        break;
      default:
        lengthTable[i++] = code;
        prev = code;
        break;
    }
  }

  litlenTable =  buildHuffmanTable(lengthTable.subarray(0, hlit))
      ;
  distTable =  buildHuffmanTable(lengthTable.subarray(hlit))
      ;

  switch (this.bufferType) {
    case Zlib.RawInflate.BufferType.ADAPTIVE:
      this.decodeHuffmanAdaptive(litlenTable, distTable);
      break;
    case Zlib.RawInflate.BufferType.BLOCK:
      this.decodeHuffmanBlock(litlenTable, distTable);
      break;
    default:
      throw new Error('invalid inflate mode');
  }
};

/**
 * decode huffman code
 * @param {!(Array.<number>|Uint16Array)} litlen literal and length code table.
 * @param {!(Array.<number>|Uint8Array)} dist distination code table.
 */
Zlib.RawInflate.prototype.decodeHuffmanBlock = function(litlen, dist) {
  var output = this.output;
  var op = this.op;

  this.currentLitlenTable = litlen;

  /** @type {number} output position limit. */
  var olength = output.length - Zlib.RawInflate.MaxCopyLength;
  /** @type {number} huffman code. */
  var code;
  /** @type {number} table index. */
  var ti;
  /** @type {number} huffman code distination. */
  var codeDist;
  /** @type {number} huffman code length. */
  var codeLength;

  var lengthCodeTable = Zlib.RawInflate.LengthCodeTable;
  var lengthExtraTable = Zlib.RawInflate.LengthExtraTable;
  var distCodeTable = Zlib.RawInflate.DistCodeTable;
  var distExtraTable = Zlib.RawInflate.DistExtraTable;

  while ((code = this.readCodeByTable(litlen)) !== 256) {
    // literal
    if (code < 256) {
      if (op >= olength) {
        this.op = op;
        output = this.expandBufferBlock();
        op = this.op;
      }
      output[op++] = code;

      continue;
    }

    // length code
    ti = code - 257;
    codeLength = lengthCodeTable[ti];
    if (lengthExtraTable[ti] > 0) {
      codeLength += this.readBits(lengthExtraTable[ti]);
    }

    // dist code
    code = this.readCodeByTable(dist);
    codeDist = distCodeTable[code];
    if (distExtraTable[code] > 0) {
      codeDist += this.readBits(distExtraTable[code]);
    }

    // lz77 decode
    if (op >= olength) {
      this.op = op;
      output = this.expandBufferBlock();
      op = this.op;
    }
    while (codeLength--) {
      output[op] = output[(op++) - codeDist];
    }
  }

  while (this.bitsbuflen >= 8) {
    this.bitsbuflen -= 8;
    this.ip--;
  }
  this.op = op;
};

/**
 * decode huffman code (adaptive)
 * @param {!(Array.<number>|Uint16Array)} litlen literal and length code table.
 * @param {!(Array.<number>|Uint8Array)} dist distination code table.
 */
Zlib.RawInflate.prototype.decodeHuffmanAdaptive = function(litlen, dist) {
  var output = this.output;
  var op = this.op;

  this.currentLitlenTable = litlen;

  /** @type {number} output position limit. */
  var olength = output.length;
  /** @type {number} huffman code. */
  var code;
  /** @type {number} table index. */
  var ti;
  /** @type {number} huffman code distination. */
  var codeDist;
  /** @type {number} huffman code length. */
  var codeLength;

  var lengthCodeTable = Zlib.RawInflate.LengthCodeTable;
  var lengthExtraTable = Zlib.RawInflate.LengthExtraTable;
  var distCodeTable = Zlib.RawInflate.DistCodeTable;
  var distExtraTable = Zlib.RawInflate.DistExtraTable;

  while ((code = this.readCodeByTable(litlen)) !== 256) {
    // literal
    if (code < 256) {
      if (op >= olength) {
        output = this.expandBufferAdaptive();
        olength = output.length;
      }
      output[op++] = code;

      continue;
    }

    // length code
    ti = code - 257;
    codeLength = lengthCodeTable[ti];
    if (lengthExtraTable[ti] > 0) {
      codeLength += this.readBits(lengthExtraTable[ti]);
    }

    // dist code
    code = this.readCodeByTable(dist);
    codeDist = distCodeTable[code];
    if (distExtraTable[code] > 0) {
      codeDist += this.readBits(distExtraTable[code]);
    }

    // lz77 decode
    if (op + codeLength > olength) {
      output = this.expandBufferAdaptive();
      olength = output.length;
    }
    while (codeLength--) {
      output[op] = output[(op++) - codeDist];
    }
  }

  while (this.bitsbuflen >= 8) {
    this.bitsbuflen -= 8;
    this.ip--;
  }
  this.op = op;
};

/**
 * expand output buffer.
 * @param {Object=} opt_param option parameters.
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.expandBufferBlock = function(opt_param) {
  /** @type {!(Array.<number>|Uint8Array)} store buffer. */
  var buffer =
      new ( Uint8Array )(
          this.op - Zlib.RawInflate.MaxBackwardLength
      );
  /** @type {number} backward base point */
  var backward = this.op - Zlib.RawInflate.MaxBackwardLength;

  var output = this.output;

  // copy to output buffer
  {
    buffer.set(output.subarray(Zlib.RawInflate.MaxBackwardLength, buffer.length));
  }

  this.blocks.push(buffer);
  this.totalpos += buffer.length;

  // copy to backward buffer
  {
    output.set(
        output.subarray(backward, backward + Zlib.RawInflate.MaxBackwardLength)
    );
  }

  this.op = Zlib.RawInflate.MaxBackwardLength;

  return output;
};

/**
 * expand output buffer. (adaptive)
 * @param {Object=} opt_param option parameters.
 * @return {!(Array.<number>|Uint8Array)} output buffer pointer.
 */
Zlib.RawInflate.prototype.expandBufferAdaptive = function(opt_param) {
  /** @type {!(Array.<number>|Uint8Array)} store buffer. */
  var buffer;
  /** @type {number} expantion ratio. */
  var ratio = (this.input.length / this.ip + 1) | 0;
  /** @type {number} maximum number of huffman code. */
  var maxHuffCode;
  /** @type {number} new output buffer size. */
  var newSize;
  /** @type {number} max inflate size. */
  var maxInflateSize;

  var input = this.input;
  var output = this.output;

  if (opt_param) {
    if (typeof opt_param.fixRatio === 'number') {
      ratio = opt_param.fixRatio;
    }
    if (typeof opt_param.addRatio === 'number') {
      ratio += opt_param.addRatio;
    }
  }

  // calculate new buffer size
  if (ratio < 2) {
    maxHuffCode =
        (input.length - this.ip) / this.currentLitlenTable[2];
    maxInflateSize = (maxHuffCode / 2 * 258) | 0;
    newSize = maxInflateSize < output.length ?
        output.length + maxInflateSize :
        output.length << 1;
  } else {
    newSize = output.length * ratio;
  }

  // buffer expantion
  {
    buffer = new Uint8Array(newSize);
    buffer.set(output);
  }

  this.output = buffer;

  return this.output;
};

/**
 * concat output buffer.
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.concatBufferBlock = function() {
  /** @type {number} buffer pointer. */
  var pos = 0;
  /** @type {number} buffer pointer. */
  var limit = this.totalpos + (this.op - Zlib.RawInflate.MaxBackwardLength);
  /** @type {!(Array.<number>|Uint8Array)} output block array. */
  var output = this.output;
  /** @type {!Array} blocks array. */
  var blocks = this.blocks;
  /** @type {!(Array.<number>|Uint8Array)} output block array. */
  var block;
  /** @type {!(Array.<number>|Uint8Array)} output buffer. */
  var buffer = new ( Uint8Array )(limit);
  /** @type {number} loop counter. */
  var i;
  /** @type {number} loop limiter. */
  var il;
  /** @type {number} loop counter. */
  var j;
  /** @type {number} loop limiter. */
  var jl;

  // single buffer
  if (blocks.length === 0) {
    return         this.output.subarray(Zlib.RawInflate.MaxBackwardLength, this.op) ;
  }

  // copy to buffer
  for (i = 0, il = blocks.length; i < il; ++i) {
    block = blocks[i];
    for (j = 0, jl = block.length; j < jl; ++j) {
      buffer[pos++] = block[j];
    }
  }

  // current buffer
  for (i = Zlib.RawInflate.MaxBackwardLength, il = this.op; i < il; ++i) {
    buffer[pos++] = output[i];
  }

  this.blocks = [];
  this.buffer = buffer;

  return this.buffer;
};

/**
 * concat output buffer. (dynamic)
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.concatBufferDynamic = function() {
  /** @type {Array.<number>|Uint8Array} output buffer. */
  var buffer;
  var op = this.op;

  {
    if (this.resize) {
      buffer = new Uint8Array(op);
      buffer.set(this.output.subarray(0, op));
    } else {
      buffer = this.output.subarray(0, op);
    }
  }

  this.buffer = buffer;

  return this.buffer;
};




var buildHuffmanTable = Zlib.Huffman.buildHuffmanTable;

/**
 * @param {!(Uint8Array|Array.<number>)} input input buffer.
 * @param {number} ip input buffer pointer.
 * @param {number=} opt_buffersize buffer block size.
 * @constructor
 */
Zlib.RawInflateStream = function(input, ip, opt_buffersize) {
  /** @type {!Array.<(Array|Uint8Array)>} */
  this.blocks = [];
  /** @type {number} block size. */
  this.bufferSize =
      opt_buffersize ? opt_buffersize : ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE;
  /** @type {!number} total output buffer pointer. */
  this.totalpos = 0;
  /** @type {!number} input buffer pointer. */
  this.ip = ip === void 0 ? 0 : ip;
  /** @type {!number} bit stream reader buffer. */
  this.bitsbuf = 0;
  /** @type {!number} bit stream reader buffer size. */
  this.bitsbuflen = 0;
  /** @type {!(Array|Uint8Array)} input buffer. */
  this.input =  new Uint8Array(input) ;
  /** @type {!(Uint8Array|Array)} output buffer. */
  this.output = new ( Uint8Array )(this.bufferSize);
  /** @type {!number} output buffer pointer. */
  this.op = 0;
  /** @type {boolean} is final block flag. */
  this.bfinal = false;
  /** @type {number} uncompressed block length. */
  this.blockLength;
  /** @type {boolean} resize flag for memory size optimization. */
  this.resize = false;
  /** @type {Array} */
  this.litlenTable;
  /** @type {Array} */
  this.distTable;
  /** @type {number} */
  this.sp = 0; // stream pointer
  /** @type {Zlib.RawInflateStream.Status} */
  this.status = Zlib.RawInflateStream.Status.INITIALIZED;

  //
  // backup
  //
  /** @type {!number} */
  this.ip_;
  /** @type {!number} */
  this.bitsbuflen_;
  /** @type {!number} */
  this.bitsbuf_;
};

/**
 * @enum {number}
 */
Zlib.RawInflateStream.BlockType = {
  UNCOMPRESSED: 0,
  FIXED: 1,
  DYNAMIC: 2
};

/**
 * @enum {number}
 */
Zlib.RawInflateStream.Status = {
  INITIALIZED: 0,
  BLOCK_HEADER_START: 1,
  BLOCK_HEADER_END: 2,
  BLOCK_BODY_START: 3,
  BLOCK_BODY_END: 4,
  DECODE_BLOCK_START: 5,
  DECODE_BLOCK_END: 6
};

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.RawInflateStream.prototype.decompress = function(newInput, ip) {
  /** @type {boolean} */
  var stop = false;

  if (newInput !== void 0) {
    this.input = newInput;
  }

  if (ip !== void 0) {
    this.ip = ip;
  }

  // decompress
  while (!stop) {
    switch (this.status) {
        // block header
      case Zlib.RawInflateStream.Status.INITIALIZED:
      case Zlib.RawInflateStream.Status.BLOCK_HEADER_START:
        if (this.readBlockHeader() < 0) {
          stop = true;
        }
        break;
        // block body
      case Zlib.RawInflateStream.Status.BLOCK_HEADER_END: /* FALLTHROUGH */
      case Zlib.RawInflateStream.Status.BLOCK_BODY_START:
        switch(this.currentBlockType) {
          case Zlib.RawInflateStream.BlockType.UNCOMPRESSED:
            if (this.readUncompressedBlockHeader() < 0) {
              stop = true;
            }
            break;
          case Zlib.RawInflateStream.BlockType.FIXED:
            if (this.parseFixedHuffmanBlock() < 0) {
              stop = true;
            }
            break;
          case Zlib.RawInflateStream.BlockType.DYNAMIC:
            if (this.parseDynamicHuffmanBlock() < 0) {
              stop = true;
            }
            break;
        }
        break;
        // decode data
      case Zlib.RawInflateStream.Status.BLOCK_BODY_END:
      case Zlib.RawInflateStream.Status.DECODE_BLOCK_START:
        switch(this.currentBlockType) {
          case Zlib.RawInflateStream.BlockType.UNCOMPRESSED:
            if (this.parseUncompressedBlock() < 0) {
              stop = true;
            }
            break;
          case Zlib.RawInflateStream.BlockType.FIXED: /* FALLTHROUGH */
          case Zlib.RawInflateStream.BlockType.DYNAMIC:
            if (this.decodeHuffman() < 0) {
              stop = true;
            }
            break;
        }
        break;
      case Zlib.RawInflateStream.Status.DECODE_BLOCK_END:
        if (this.bfinal) {
          stop = true;
        } else {
          this.status = Zlib.RawInflateStream.Status.INITIALIZED;
        }
        break;
    }
  }

  return this.concatBuffer();
};

/**
 * @const
 * @type {number} max backward length for LZ77.
 */
Zlib.RawInflateStream.MaxBackwardLength = 32768;

/**
 * @const
 * @type {number} max copy length for LZ77.
 */
Zlib.RawInflateStream.MaxCopyLength = 258;

/**
 * huffman order
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.Order = (function(table) {
  return  new Uint16Array(table) ;
})([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

/**
 * huffman length code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflateStream.LengthCodeTable = (function(table) {
  return  new Uint16Array(table) ;
})([
  0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009, 0x000a, 0x000b,
  0x000d, 0x000f, 0x0011, 0x0013, 0x0017, 0x001b, 0x001f, 0x0023, 0x002b,
  0x0033, 0x003b, 0x0043, 0x0053, 0x0063, 0x0073, 0x0083, 0x00a3, 0x00c3,
  0x00e3, 0x0102, 0x0102, 0x0102
]);

/**
 * huffman length extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.LengthExtraTable = (function(table) {
  return  new Uint8Array(table) ;
})([
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5,
  5, 5, 0, 0, 0
]);

/**
 * huffman dist code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflateStream.DistCodeTable = (function(table) {
  return  new Uint16Array(table) ;
})([
  0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0007, 0x0009, 0x000d, 0x0011,
  0x0019, 0x0021, 0x0031, 0x0041, 0x0061, 0x0081, 0x00c1, 0x0101, 0x0181,
  0x0201, 0x0301, 0x0401, 0x0601, 0x0801, 0x0c01, 0x1001, 0x1801, 0x2001,
  0x3001, 0x4001, 0x6001
]);

/**
 * huffman dist extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.DistExtraTable = (function(table) {
  return  new Uint8Array(table) ;
})([
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11,
  11, 12, 12, 13, 13
]);

/**
 * fixed huffman length code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflateStream.FixedLiteralLengthTable = (function(table) {
  return table;
})((function() {
  var lengths = new ( Uint8Array )(288);
  var i, il;

  for (i = 0, il = lengths.length; i < il; ++i) {
    lengths[i] =
        (i <= 143) ? 8 :
            (i <= 255) ? 9 :
                (i <= 279) ? 7 :
                    8;
  }

  return buildHuffmanTable(lengths);
})());

/**
 * fixed huffman distance code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflateStream.FixedDistanceTable = (function(table) {
  return table;
})((function() {
  var lengths = new ( Uint8Array )(30);
  var i, il;

  for (i = 0, il = lengths.length; i < il; ++i) {
    lengths[i] = 5;
  }

  return buildHuffmanTable(lengths);
})());

/**
 * parse deflated block.
 */
Zlib.RawInflateStream.prototype.readBlockHeader = function() {
  /** @type {number} header */
  var hdr;

  this.status = Zlib.RawInflateStream.Status.BLOCK_HEADER_START;

  this.save_();
  if ((hdr = this.readBits(3)) < 0) {
    this.restore_();
    return -1;
  }

  // BFINAL
  if (hdr & 0x1) {
    this.bfinal = true;
  }

  // BTYPE
  hdr >>>= 1;
  switch (hdr) {
    case 0: // uncompressed
      this.currentBlockType = Zlib.RawInflateStream.BlockType.UNCOMPRESSED;
      break;
    case 1: // fixed huffman
      this.currentBlockType = Zlib.RawInflateStream.BlockType.FIXED;
      break;
    case 2: // dynamic huffman
      this.currentBlockType = Zlib.RawInflateStream.BlockType.DYNAMIC;
      break;
    default: // reserved or other
      throw new Error('unknown BTYPE: ' + hdr);
  }

  this.status = Zlib.RawInflateStream.Status.BLOCK_HEADER_END;
};

/**
 * read inflate bits
 * @param {number} length bits length.
 * @return {number} read bits.
 */
Zlib.RawInflateStream.prototype.readBits = function(length) {
  var bitsbuf = this.bitsbuf;
  var bitsbuflen = this.bitsbuflen;
  var input = this.input;
  var ip = this.ip;

  /** @type {number} input and output byte. */
  var octet;

  // not enough buffer
  while (bitsbuflen < length) {
    // input byte
    if (input.length <= ip) {
      return -1;
    }
    octet = input[ip++];

    // concat octet
    bitsbuf |= octet << bitsbuflen;
    bitsbuflen += 8;
  }

  // output byte
  octet = bitsbuf & /* MASK */ ((1 << length) - 1);
  bitsbuf >>>= length;
  bitsbuflen -= length;

  this.bitsbuf = bitsbuf;
  this.bitsbuflen = bitsbuflen;
  this.ip = ip;

  return octet;
};

/**
 * read huffman code using table
 * @param {Array} table huffman code table.
 * @return {number} huffman code.
 */
Zlib.RawInflateStream.prototype.readCodeByTable = function(table) {
  var bitsbuf = this.bitsbuf;
  var bitsbuflen = this.bitsbuflen;
  var input = this.input;
  var ip = this.ip;

  /** @type {!(Array|Uint8Array)} huffman code table */
  var codeTable = table[0];
  /** @type {number} */
  var maxCodeLength = table[1];
  /** @type {number} input byte */
  var octet;
  /** @type {number} code length & code (16bit, 16bit) */
  var codeWithLength;
  /** @type {number} code bits length */
  var codeLength;

  // not enough buffer
  while (bitsbuflen < maxCodeLength) {
    if (input.length <= ip) {
      return -1;
    }
    octet = input[ip++];
    bitsbuf |= octet << bitsbuflen;
    bitsbuflen += 8;
  }

  // read max length
  codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
  codeLength = codeWithLength >>> 16;

  if (codeLength > bitsbuflen) {
    throw new Error('invalid code length: ' + codeLength);
  }

  this.bitsbuf = bitsbuf >> codeLength;
  this.bitsbuflen = bitsbuflen - codeLength;
  this.ip = ip;

  return codeWithLength & 0xffff;
};

/**
 * read uncompressed block header
 */
Zlib.RawInflateStream.prototype.readUncompressedBlockHeader = function() {
  /** @type {number} block length */
  var len;
  /** @type {number} number for check block length */
  var nlen;

  var input = this.input;
  var ip = this.ip;

  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

  if (ip + 4 >= input.length) {
    return -1;
  }

  len = input[ip++] | (input[ip++] << 8);
  nlen = input[ip++] | (input[ip++] << 8);

  // check len & nlen
  if (len === ~nlen) {
    throw new Error('invalid uncompressed block header: length verify');
  }

  // skip buffered header bits
  this.bitsbuf = 0;
  this.bitsbuflen = 0;

  this.ip = ip;
  this.blockLength = len;
  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;
};

/**
 * parse uncompressed block.
 */
Zlib.RawInflateStream.prototype.parseUncompressedBlock = function() {
  var input = this.input;
  var ip = this.ip;
  var output = this.output;
  var op = this.op;
  var len = this.blockLength;

  this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_START;

  // copy
  // XXX: とりあえず素直にコピー
  while (len--) {
    if (op === output.length) {
      output = this.expandBuffer({fixRatio: 2});
    }

    // not enough input buffer
    if (ip >= input.length) {
      this.ip = ip;
      this.op = op;
      this.blockLength = len + 1; // コピーしてないので戻す
      return -1;
    }

    output[op++] = input[ip++];
  }

  if (len < 0) {
    this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_END;
  }

  this.ip = ip;
  this.op = op;

  return 0;
};

/**
 * parse fixed huffman block.
 */
Zlib.RawInflateStream.prototype.parseFixedHuffmanBlock = function() {
  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

  this.litlenTable = Zlib.RawInflateStream.FixedLiteralLengthTable;
  this.distTable = Zlib.RawInflateStream.FixedDistanceTable;

  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;

  return 0;
};

/**
 * オブジェクトのコンテキストを別のプロパティに退避する.
 * @private
 */
Zlib.RawInflateStream.prototype.save_ = function() {
  this.ip_ = this.ip;
  this.bitsbuflen_ = this.bitsbuflen;
  this.bitsbuf_ = this.bitsbuf;
};

/**
 * 別のプロパティに退避したコンテキストを復元する.
 * @private
 */
Zlib.RawInflateStream.prototype.restore_ = function() {
  this.ip = this.ip_;
  this.bitsbuflen = this.bitsbuflen_;
  this.bitsbuf = this.bitsbuf_;
};

/**
 * parse dynamic huffman block.
 */
Zlib.RawInflateStream.prototype.parseDynamicHuffmanBlock = function() {
  /** @type {number} number of literal and length codes. */
  var hlit;
  /** @type {number} number of distance codes. */
  var hdist;
  /** @type {number} number of code lengths. */
  var hclen;
  /** @type {!(Uint8Array|Array)} code lengths. */
  var codeLengths =
      new ( Uint8Array )(Zlib.RawInflateStream.Order.length);
  /** @type {!Array} code lengths table. */
  var codeLengthsTable;

  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

  this.save_();
  hlit = this.readBits(5) + 257;
  hdist = this.readBits(5) + 1;
  hclen = this.readBits(4) + 4;
  if (hlit < 0 || hdist < 0 || hclen < 0) {
    this.restore_();
    return -1;
  }

  try {
    parseDynamicHuffmanBlockImpl.call(this);
  } catch(e) {
    this.restore_();
    return -1;
  }

  function parseDynamicHuffmanBlockImpl() {
    /** @type {number} */
    var bits;
    var code;
    var prev = 0;
    var repeat;
    /** @type {!(Uint8Array|Array.<number>)} code length table. */
    var lengthTable;
    /** @type {number} loop counter. */
    var i;
    /** @type {number} loop limit. */
    var il;

    // decode code lengths
    for (i = 0; i < hclen; ++i) {
      if ((bits = this.readBits(3)) < 0) {
        throw new Error('not enough input');
      }
      codeLengths[Zlib.RawInflateStream.Order[i]] = bits;
    }

    // decode length table
    codeLengthsTable = buildHuffmanTable(codeLengths);
    lengthTable = new ( Uint8Array )(hlit + hdist);
    for (i = 0, il = hlit + hdist; i < il;) {
      code = this.readCodeByTable(codeLengthsTable);
      if (code < 0) {
        throw new Error('not enough input');
      }
      switch (code) {
        case 16:
          if ((bits = this.readBits(2)) < 0) {
            throw new Error('not enough input');
          }
          repeat = 3 + bits;
          while (repeat--) { lengthTable[i++] = prev; }
          break;
        case 17:
          if ((bits = this.readBits(3)) < 0) {
            throw new Error('not enough input');
          }
          repeat = 3 + bits;
          while (repeat--) { lengthTable[i++] = 0; }
          prev = 0;
          break;
        case 18:
          if ((bits = this.readBits(7)) < 0) {
            throw new Error('not enough input');
          }
          repeat = 11 + bits;
          while (repeat--) { lengthTable[i++] = 0; }
          prev = 0;
          break;
        default:
          lengthTable[i++] = code;
          prev = code;
          break;
      }
    }

    this.litlenTable =  buildHuffmanTable(lengthTable.subarray(0, hlit))
        ;
    this.distTable =  buildHuffmanTable(lengthTable.subarray(hlit))
        ;
  }

  this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;

  return 0;
};

/**
 * decode huffman code (dynamic)
 * @return {(number|undefined)} -1 is error.
 */
Zlib.RawInflateStream.prototype.decodeHuffman = function() {
  var output = this.output;
  var op = this.op;

  /** @type {number} huffman code. */
  var code;
  /** @type {number} table index. */
  var ti;
  /** @type {number} huffman code distination. */
  var codeDist;
  /** @type {number} huffman code length. */
  var codeLength;

  var litlen = this.litlenTable;
  var dist = this.distTable;

  var olength = output.length;
  var bits;

  this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_START;

  while (true) {
    this.save_();

    code = this.readCodeByTable(litlen);
    if (code < 0) {
      this.op = op;
      this.restore_();
      return -1;
    }

    if (code === 256) {
      break;
    }

    // literal
    if (code < 256) {
      if (op === olength) {
        output = this.expandBuffer();
        olength = output.length;
      }
      output[op++] = code;

      continue;
    }

    // length code
    ti = code - 257;
    codeLength = Zlib.RawInflateStream.LengthCodeTable[ti];
    if (Zlib.RawInflateStream.LengthExtraTable[ti] > 0) {
      bits = this.readBits(Zlib.RawInflateStream.LengthExtraTable[ti]);
      if (bits < 0) {
        this.op = op;
        this.restore_();
        return -1;
      }
      codeLength += bits;
    }

    // dist code
    code = this.readCodeByTable(dist);
    if (code < 0) {
      this.op = op;
      this.restore_();
      return -1;
    }
    codeDist = Zlib.RawInflateStream.DistCodeTable[code];
    if (Zlib.RawInflateStream.DistExtraTable[code] > 0) {
      bits = this.readBits(Zlib.RawInflateStream.DistExtraTable[code]);
      if (bits < 0) {
        this.op = op;
        this.restore_();
        return -1;
      }
      codeDist += bits;
    }

    // lz77 decode
    if (op + codeLength >= olength) {
      output = this.expandBuffer();
      olength = output.length;
    }

    while (codeLength--) {
      output[op] = output[(op++) - codeDist];
    }

    // break
    if (this.ip === this.input.length) {
      this.op = op;
      return -1;
    }
  }

  while (this.bitsbuflen >= 8) {
    this.bitsbuflen -= 8;
    this.ip--;
  }

  this.op = op;
  this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_END;
};

/**
 * expand output buffer. (dynamic)
 * @param {Object=} opt_param option parameters.
 * @return {!(Array|Uint8Array)} output buffer pointer.
 */
Zlib.RawInflateStream.prototype.expandBuffer = function(opt_param) {
  /** @type {!(Array|Uint8Array)} store buffer. */
  var buffer;
  /** @type {number} expantion ratio. */
  var ratio = (this.input.length / this.ip + 1) | 0;
  /** @type {number} maximum number of huffman code. */
  var maxHuffCode;
  /** @type {number} new output buffer size. */
  var newSize;
  /** @type {number} max inflate size. */
  var maxInflateSize;

  var input = this.input;
  var output = this.output;

  if (opt_param) {
    if (typeof opt_param.fixRatio === 'number') {
      ratio = opt_param.fixRatio;
    }
    if (typeof opt_param.addRatio === 'number') {
      ratio += opt_param.addRatio;
    }
  }

  // calculate new buffer size
  if (ratio < 2) {
    maxHuffCode =
        (input.length - this.ip) / this.litlenTable[2];
    maxInflateSize = (maxHuffCode / 2 * 258) | 0;
    newSize = maxInflateSize < output.length ?
        output.length + maxInflateSize :
        output.length << 1;
  } else {
    newSize = output.length * ratio;
  }

  // buffer expantion
  {
    buffer = new Uint8Array(newSize);
    buffer.set(output);
  }

  this.output = buffer;

  return this.output;
};

/**
 * concat output buffer. (dynamic)
 * @return {!(Array|Uint8Array)} output buffer.
 */
Zlib.RawInflateStream.prototype.concatBuffer = function() {
  /** @type {!(Array|Uint8Array)} output buffer. */
  var buffer;
  /** @type {number} */
  var op = this.op;
  /** @type {Uint8Array} */
  var tmp;

  if (this.resize) {
    {
      buffer = new Uint8Array(this.output.subarray(this.sp, op));
    }
  } else {
    buffer =
         this.output.subarray(this.sp, op) ;
  }

  this.sp = op;

  // compaction
  if (op > Zlib.RawInflateStream.MaxBackwardLength + this.bufferSize) {
    this.op = this.sp = Zlib.RawInflateStream.MaxBackwardLength;
    {
      tmp = /** @type {Uint8Array} */(this.output);
      this.output = new Uint8Array(this.bufferSize + Zlib.RawInflateStream.MaxBackwardLength);
      this.output.set(tmp.subarray(op - Zlib.RawInflateStream.MaxBackwardLength, op));
    }
  }

  return buffer;
};


/**
 * @constructor
 * @param {!(Uint8Array|Array)} input deflated buffer.
 * @param {Object=} opt_params option parameters.
 *
 * opt_params は以下のプロパティを指定する事ができます。
 *   - index: input buffer の deflate コンテナの開始位置.
 *   - blockSize: バッファのブロックサイズ.
 *   - verify: 伸張が終わった後 adler-32 checksum の検証を行うか.
 *   - bufferType: Zlib.Inflate.BufferType の値によってバッファの管理方法を指定する.
 *       Zlib.Inflate.BufferType は Zlib.RawInflate.BufferType のエイリアス.
 */
Zlib.Inflate = function(input, opt_params) {
  /** @type {number} */
  var cmf;
  /** @type {number} */
  var flg;

  /** @type {!(Uint8Array|Array)} */
  this.input = input;
  /** @type {number} */
  this.ip = 0;
  /** @type {Zlib.RawInflate} */
  this.rawinflate;
  /** @type {(boolean|undefined)} verify flag. */
  this.verify;

  // option parameters
  if (opt_params || !(opt_params = {})) {
    if (opt_params['index']) {
      this.ip = opt_params['index'];
    }
    if (opt_params['verify']) {
      this.verify = opt_params['verify'];
    }
  }

  // Compression Method and Flags
  cmf = input[this.ip++];
  flg = input[this.ip++];

  // compression method
  switch (cmf & 0x0f) {
    case Zlib.CompressionMethod.DEFLATE:
      this.method = Zlib.CompressionMethod.DEFLATE;
      break;
    default:
      throw new Error('unsupported compression method');
  }

  // fcheck
  if (((cmf << 8) + flg) % 31 !== 0) {
    throw new Error('invalid fcheck flag:' + ((cmf << 8) + flg) % 31);
  }

  // fdict (not supported)
  if (flg & 0x20) {
    throw new Error('fdict flag is not supported');
  }

  // RawInflate
  this.rawinflate = new Zlib.RawInflate(input, {
    'index': this.ip,
    'bufferSize': opt_params['bufferSize'],
    'bufferType': opt_params['bufferType'],
    'resize': opt_params['resize']
  });
};

/**
 * @enum {number}
 */
Zlib.Inflate.BufferType = Zlib.RawInflate.BufferType;

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.Inflate.prototype.decompress = function() {
  /** @type {!(Array|Uint8Array)} input buffer. */
  var input = this.input;
  /** @type {!(Uint8Array|Array)} inflated buffer. */
  var buffer;
  /** @type {number} adler-32 checksum */
  var adler32;

  buffer = this.rawinflate.decompress();
  this.ip = this.rawinflate.ip;

  // verify adler-32
  if (this.verify) {
    adler32 = (
        input[this.ip++] << 24 | input[this.ip++] << 16 |
        input[this.ip++] << 8 | input[this.ip++]
    ) >>> 0;

    if (adler32 !== Zlib.Adler32(buffer)) {
      throw new Error('invalid adler-32 checksum');
    }
  }

  return buffer;
};


/* vim:set expandtab ts=2 sw=2 tw=80: */


/**
 * @param {!(Uint8Array|Array)} input deflated buffer.
 * @constructor
 */
Zlib.InflateStream = function(input) {
  /** @type {!(Uint8Array|Array)} */
  this.input = input === void 0 ? new ( Uint8Array )() : input;
  /** @type {number} */
  this.ip = 0;
  /** @type {Zlib.RawInflateStream} */
  this.rawinflate = new Zlib.RawInflateStream(this.input, this.ip);
  /** @type {Zlib.CompressionMethod} */
  this.method;
  /** @type {!(Array|Uint8Array)} */
  this.output = this.rawinflate.output;
};

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.InflateStream.prototype.decompress = function(input) {
  /** @type {!(Uint8Array|Array)} inflated buffer. */
  var buffer;

  // 新しい入力を入力バッファに結合する
  // XXX Array, Uint8Array のチェックを行うか確認する
  if (input !== void 0) {
    {
      var tmp = new Uint8Array(this.input.length + input.length);
      tmp.set(this.input, 0);
      tmp.set(input, this.input.length);
      this.input = tmp;
    }
  }

  if (this.method === void 0) {
    if(this.readHeader() < 0) {
      return new ( Uint8Array )();
    }
  }

  buffer = this.rawinflate.decompress(this.input, this.ip);
  if (this.rawinflate.ip !== 0) {
    this.input = 
        this.input.subarray(this.rawinflate.ip) ;
    this.ip = 0;
  }

  // verify adler-32
  /*
  if (this.verify) {
    adler32 =
      input[this.ip++] << 24 | input[this.ip++] << 16 |
      input[this.ip++] << 8 | input[this.ip++];

    if (adler32 !== Zlib.Adler32(buffer)) {
      throw new Error('invalid adler-32 checksum');
    }
  }
  */

  return buffer;
};

Zlib.InflateStream.prototype.readHeader = function() {
  var ip = this.ip;
  var input = this.input;

  // Compression Method and Flags
  var cmf = input[ip++];
  var flg = input[ip++];

  if (cmf === void 0 || flg === void 0) {
    return -1;
  }

  // compression method
  switch (cmf & 0x0f) {
    case Zlib.CompressionMethod.DEFLATE:
      this.method = Zlib.CompressionMethod.DEFLATE;
      break;
    default:
      throw new Error('unsupported compression method');
  }

  // fcheck
  if (((cmf << 8) + flg) % 31 !== 0) {
    throw new Error('invalid fcheck flag:' + ((cmf << 8) + flg) % 31);
  }

  // fdict (not supported)
  if (flg & 0x20) {
    throw new Error('fdict flag is not supported');
  }

  this.ip = ip;
};


/**
 * @fileoverview GZIP (RFC1952) 展開コンテナ実装.
 */

/**
 * @constructor
 * @param {!(Array|Uint8Array)} input input buffer.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Gunzip = function(input, opt_params) {
  /** @type {!(Array.<number>|Uint8Array)} input buffer. */
  this.input = input;
  /** @type {number} input buffer pointer. */
  this.ip = 0;
  /** @type {Array.<Zlib.GunzipMember>} */
  this.member = [];
  /** @type {boolean} */
  this.decompressed = false;
};

/**
 * @return {Array.<Zlib.GunzipMember>}
 */
Zlib.Gunzip.prototype.getMembers = function() {
  if (!this.decompressed) {
    this.decompress();
  }

  return this.member.slice();
};

/**
 * inflate gzip data.
 * @return {!(Array.<number>|Uint8Array)} inflated buffer.
 */
Zlib.Gunzip.prototype.decompress = function() {
  /** @type {number} input length. */
  var il = this.input.length;

  while (this.ip < il) {
    this.decodeMember();
  }

  this.decompressed = true;

  return this.concatMember();
};

/**
 * decode gzip member.
 */
Zlib.Gunzip.prototype.decodeMember = function() {
  /** @type {Zlib.GunzipMember} */
  var member = new Zlib.GunzipMember();
  /** @type {number} */
  var isize;
  /** @type {Zlib.RawInflate} RawInflate implementation. */
  var rawinflate;
  /** @type {!(Array.<number>|Uint8Array)} inflated data. */
  var inflated;
  /** @type {number} inflate size */
  var inflen;
  /** @type {number} character code */
  var c;
  /** @type {number} character index in string. */
  var ci;
  /** @type {Array.<string>} character array. */
  var str;
  /** @type {number} modification time. */
  var mtime;
  /** @type {number} */
  var crc32;

  var input = this.input;
  var ip = this.ip;

  member.id1 = input[ip++];
  member.id2 = input[ip++];

  // check signature
  if (member.id1 !== 0x1f || member.id2 !== 0x8b) {
    throw new Error('invalid file signature:' + member.id1 + ',' + member.id2);
  }

  // check compression method
  member.cm = input[ip++];
  switch (member.cm) {
    case 8: /* XXX: use Zlib const */
      break;
    default:
      throw new Error('unknown compression method: ' + member.cm);
  }

  // flags
  member.flg = input[ip++];

  // modification time
  mtime = (input[ip++])       |
      (input[ip++] << 8)  |
      (input[ip++] << 16) |
      (input[ip++] << 24);
  member.mtime = new Date(mtime * 1000);

  // extra flags
  member.xfl = input[ip++];

  // operating system
  member.os = input[ip++];

  // extra
  if ((member.flg & Zlib.Gzip.FlagsMask.FEXTRA) > 0) {
    member.xlen = input[ip++] | (input[ip++] << 8);
    ip = this.decodeSubField(ip, member.xlen);
  }

  // fname
  if ((member.flg & Zlib.Gzip.FlagsMask.FNAME) > 0) {
    for(str = [], ci = 0; (c = input[ip++]) > 0;) {
      str[ci++] = String.fromCharCode(c);
    }
    member.name = str.join('');
  }

  // fcomment
  if ((member.flg & Zlib.Gzip.FlagsMask.FCOMMENT) > 0) {
    for(str = [], ci = 0; (c = input[ip++]) > 0;) {
      str[ci++] = String.fromCharCode(c);
    }
    member.comment = str.join('');
  }

  // fhcrc
  if ((member.flg & Zlib.Gzip.FlagsMask.FHCRC) > 0) {
    member.crc16 = Zlib.CRC32.calc(input, 0, ip) & 0xffff;
    if (member.crc16 !== (input[ip++] | (input[ip++] << 8))) {
      throw new Error('invalid header crc16');
    }
  }

  // isize を事前に取得すると展開後のサイズが分かるため、
  // inflate処理のバッファサイズが事前に分かり、高速になる
  isize = (input[input.length - 4])       | (input[input.length - 3] << 8) |
      (input[input.length - 2] << 16) | (input[input.length - 1] << 24);

  // isize の妥当性チェック
  // ハフマン符号では最小 2-bit のため、最大で 1/4 になる
  // LZ77 符号では 長さと距離 2-Byte で最大 258-Byte を表現できるため、
  // 1/128 になるとする
  // ここから入力バッファの残りが isize の 512 倍以上だったら
  // サイズ指定のバッファ確保は行わない事とする
  if (input.length - ip - /* CRC-32 */4 - /* ISIZE */4 < isize * 512) {
    inflen = isize;
  }

  // compressed block
  rawinflate = new Zlib.RawInflate(input, {'index': ip, 'bufferSize': inflen});
  member.data = inflated = rawinflate.decompress();
  ip = rawinflate.ip;

  // crc32
  member.crc32 = crc32 =
      ((input[ip++])       | (input[ip++] << 8) |
          (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
  if (Zlib.CRC32.calc(inflated) !== crc32) {
    throw new Error('invalid CRC-32 checksum: 0x' +
        Zlib.CRC32.calc(inflated).toString(16) + ' / 0x' + crc32.toString(16));
  }

  // input size
  member.isize = isize =
      ((input[ip++])       | (input[ip++] << 8) |
          (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
  if ((inflated.length & 0xffffffff) !== isize) {
    throw new Error('invalid input size: ' +
        (inflated.length & 0xffffffff) + ' / ' + isize);
  }

  this.member.push(member);
  this.ip = ip;
};

/**
 * サブフィールドのデコード
 * XXX: 現在は何もせずスキップする
 */
Zlib.Gunzip.prototype.decodeSubField = function(ip, length) {
  return ip + length;
};

/**
 * @return {!(Array.<number>|Uint8Array)}
 */
Zlib.Gunzip.prototype.concatMember = function() {
  /** @type {Array.<Zlib.GunzipMember>} */
  var member = this.member;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {number} */
  var p = 0;
  /** @type {number} */
  var size = 0;
  /** @type {!(Array.<number>|Uint8Array)} */
  var buffer;

  for (i = 0, il = member.length; i < il; ++i) {
    size += member[i].data.length;
  }

  {
    buffer = new Uint8Array(size);
    for (i = 0; i < il; ++i) {
      buffer.set(member[i].data, p);
      p += member[i].data.length;
    }
  }

  return buffer;
};



/**
 * @constructor
 */
Zlib.GunzipMember = function() {
  /** @type {number} signature first byte. */
  this.id1;
  /** @type {number} signature second byte. */
  this.id2;
  /** @type {number} compression method. */
  this.cm;
  /** @type {number} flags. */
  this.flg;
  /** @type {Date} modification time. */
  this.mtime;
  /** @type {number} extra flags. */
  this.xfl;
  /** @type {number} operating system number. */
  this.os;
  /** @type {number} CRC-16 value for FHCRC flag. */
  this.crc16;
  /** @type {number} extra length. */
  this.xlen;
  /** @type {number} CRC-32 value for verification. */
  this.crc32;
  /** @type {number} input size modulo 32 value. */
  this.isize;
  /** @type {string} filename. */
  this.name;
  /** @type {string} comment. */
  this.comment;
  /** @type {!(Uint8Array|Array.<number>)} */
  this.data;
};

Zlib.GunzipMember.prototype.getName = function() {
  return this.name;
};

Zlib.GunzipMember.prototype.getData = function() {
  return this.data;
};

Zlib.GunzipMember.prototype.getMtime = function() {
  return this.mtime;
};

/**
 * @fileoverview GZIP (RFC1952) 実装.
 */

/**
 * @constructor
 * @param {!(Array|Uint8Array)} input input buffer.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Gzip = function(input, opt_params) {
  /** @type {!(Array.<number>|Uint8Array)} input buffer. */
  this.input = input;
  /** @type {number} input buffer pointer. */
  this.ip = 0;
  /** @type {!(Array.<number>|Uint8Array)} output buffer. */
  this.output;
  /** @type {number} output buffer. */
  this.op = 0;
  /** @type {!Object} flags option flags. */
  this.flags = {};
  /** @type {!string} filename. */
  this.filename;
  /** @type {!string} comment. */
  this.comment;
  /** @type {!Object} deflate options. */
  this.deflateOptions;

  // option parameters
  if (opt_params) {
    if (opt_params['flags']) {
      this.flags = opt_params['flags'];
    }
    if (typeof opt_params['filename'] === 'string') {
      this.filename = opt_params['filename'];
    }
    if (typeof opt_params['comment'] === 'string') {
      this.comment = opt_params['comment'];
    }
    if (opt_params['deflateOptions']) {
      this.deflateOptions = opt_params['deflateOptions'];
    }
  }

  if (!this.deflateOptions) {
    this.deflateOptions = {};
  }
};

/**
 * @type {number}
 * @const
 */
Zlib.Gzip.DefaultBufferSize = 0x8000;

/**
 * encode gzip members.
 * @return {!(Array|Uint8Array)} gzip binary array.
 */
Zlib.Gzip.prototype.compress = function() {
  /** @type {number} flags. */
  var flg;
  /** @type {number} modification time. */
  var mtime;
  /** @type {number} CRC-16 value for FHCRC flag. */
  var crc16;
  /** @type {number} CRC-32 value for verification. */
  var crc32;
  /** @type {!Zlib.RawDeflate} raw deflate object. */
  var rawdeflate;
  /** @type {number} character code */
  var c;
  /** @type {number} loop counter. */
  var i;
  /** @type {number} loop limiter. */
  var il;
  /** @type {!(Array|Uint8Array)} output buffer. */
  var output =
      new ( Uint8Array )(Zlib.Gzip.DefaultBufferSize);
  /** @type {number} output buffer pointer. */
  var op = 0;

  var input = this.input;
  var ip = this.ip;
  var filename = this.filename;
  var comment = this.comment;

  // check signature
  output[op++] = 0x1f;
  output[op++] = 0x8b;

  // check compression method
  output[op++] = 8; /* XXX: use Zlib const */

  // flags
  flg = 0;
  if (this.flags['fname'])    flg |= Zlib.Gzip.FlagsMask.FNAME;
  if (this.flags['fcomment']) flg |= Zlib.Gzip.FlagsMask.FCOMMENT;
  if (this.flags['fhcrc'])    flg |= Zlib.Gzip.FlagsMask.FHCRC;
  // XXX: FTEXT
  // XXX: FEXTRA
  output[op++] = flg;

  // modification time
  mtime = (Date.now ? Date.now() : +new Date()) / 1000 | 0;
  output[op++] = mtime        & 0xff;
  output[op++] = mtime >>>  8 & 0xff;
  output[op++] = mtime >>> 16 & 0xff;
  output[op++] = mtime >>> 24 & 0xff;

  // extra flags
  output[op++] = 0;

  // operating system
  output[op++] = Zlib.Gzip.OperatingSystem.UNKNOWN;

  // extra
  /* NOP */

  // fname
  if (this.flags['fname'] !== void 0) {
    for (i = 0, il = filename.length; i < il; ++i) {
      c = filename.charCodeAt(i);
      if (c > 0xff) { output[op++] = (c >>> 8) & 0xff; }
      output[op++] = c & 0xff;
    }
    output[op++] = 0; // null termination
  }

  // fcomment
  if (this.flags['comment']) {
    for (i = 0, il = comment.length; i < il; ++i) {
      c = comment.charCodeAt(i);
      if (c > 0xff) { output[op++] = (c >>> 8) & 0xff; }
      output[op++] = c & 0xff;
    }
    output[op++] = 0; // null termination
  }

  // fhcrc
  if (this.flags['fhcrc']) {
    crc16 = Zlib.CRC32.calc(output, 0, op) & 0xffff;
    output[op++] = (crc16      ) & 0xff;
    output[op++] = (crc16 >>> 8) & 0xff;
  }

  // add compress option
  this.deflateOptions['outputBuffer'] = output;
  this.deflateOptions['outputIndex'] = op;

  // compress
  rawdeflate = new Zlib.RawDeflate(input, this.deflateOptions);
  output = rawdeflate.compress();
  op = rawdeflate.op;

  // expand buffer
  {
    if (op + 8 > output.buffer.byteLength) {
      this.output = new Uint8Array(op + 8);
      this.output.set(new Uint8Array(output.buffer));
      output = this.output;
    } else {
      output = new Uint8Array(output.buffer);
    }
  }

  // crc32
  crc32 = Zlib.CRC32.calc(input);
  output[op++] = (crc32       ) & 0xff;
  output[op++] = (crc32 >>>  8) & 0xff;
  output[op++] = (crc32 >>> 16) & 0xff;
  output[op++] = (crc32 >>> 24) & 0xff;

  // input size
  il = input.length;
  output[op++] = (il       ) & 0xff;
  output[op++] = (il >>>  8) & 0xff;
  output[op++] = (il >>> 16) & 0xff;
  output[op++] = (il >>> 24) & 0xff;

  this.ip = ip;

  if ( op < output.length) {
    this.output = output = output.subarray(0, op);
  }

  return output;
};

/** @enum {number} */
Zlib.Gzip.OperatingSystem = {
  FAT: 0,
  AMIGA: 1,
  VMS: 2,
  UNIX: 3,
  VM_CMS: 4,
  ATARI_TOS: 5,
  HPFS: 6,
  MACINTOSH: 7,
  Z_SYSTEM: 8,
  CP_M: 9,
  TOPS_20: 10,
  NTFS: 11,
  QDOS: 12,
  ACORN_RISCOS: 13,
  UNKNOWN: 255
};

/** @enum {number} */
Zlib.Gzip.FlagsMask = {
  FTEXT: 0x01,
  FHCRC: 0x02,
  FEXTRA: 0x04,
  FNAME: 0x08,
  FCOMMENT: 0x10
};


/**
 * @fileoverview Heap Sort 実装. ハフマン符号化で使用する.
 */

/**
 * カスタムハフマン符号で使用するヒープ実装
 * @param {number} length ヒープサイズ.
 * @constructor
 */
Zlib.Heap = function(length) {
  this.buffer = new ( Uint16Array )(length * 2);
  this.length = 0;
};

/**
 * 親ノードの index 取得
 * @param {number} index 子ノードの index.
 * @return {number} 親ノードの index.
 *
 */
Zlib.Heap.prototype.getParent = function(index) {
  return ((index - 2) / 4 | 0) * 2;
};

/**
 * 子ノードの index 取得
 * @param {number} index 親ノードの index.
 * @return {number} 子ノードの index.
 */
Zlib.Heap.prototype.getChild = function(index) {
  return 2 * index + 2;
};

/**
 * Heap に値を追加する
 * @param {number} index キー index.
 * @param {number} value 値.
 * @return {number} 現在のヒープ長.
 */
Zlib.Heap.prototype.push = function(index, value) {
  var current, parent,
      heap = this.buffer,
      swap;

  current = this.length;
  heap[this.length++] = value;
  heap[this.length++] = index;

  // ルートノードにたどり着くまで入れ替えを試みる
  while (current > 0) {
    parent = this.getParent(current);

    // 親ノードと比較して親の方が小さければ入れ替える
    if (heap[current] > heap[parent]) {
      swap = heap[current];
      heap[current] = heap[parent];
      heap[parent] = swap;

      swap = heap[current + 1];
      heap[current + 1] = heap[parent + 1];
      heap[parent + 1] = swap;

      current = parent;
      // 入れ替えが必要なくなったらそこで抜ける
    } else {
      break;
    }
  }

  return this.length;
};

/**
 * Heapから一番大きい値を返す
 * @return {{index: number, value: number, length: number}} {index: キーindex,
 *     value: 値, length: ヒープ長} の Object.
 */
Zlib.Heap.prototype.pop = function() {
  var index, value,
      heap = this.buffer, swap,
      current, parent;

  value = heap[0];
  index = heap[1];

  // 後ろから値を取る
  this.length -= 2;
  heap[0] = heap[this.length];
  heap[1] = heap[this.length + 1];

  parent = 0;
  // ルートノードから下がっていく
  while (true) {
    current = this.getChild(parent);

    // 範囲チェック
    if (current >= this.length) {
      break;
    }

    // 隣のノードと比較して、隣の方が値が大きければ隣を現在ノードとして選択
    if (current + 2 < this.length && heap[current + 2] > heap[current]) {
      current += 2;
    }

    // 親ノードと比較して親の方が小さい場合は入れ替える
    if (heap[current] > heap[parent]) {
      swap = heap[parent];
      heap[parent] = heap[current];
      heap[current] = swap;

      swap = heap[parent + 1];
      heap[parent + 1] = heap[current + 1];
      heap[current + 1] = swap;
    } else {
      break;
    }

    parent = current;
  }

  return {index: index, value: value, length: this.length};
};


/* vim:set expandtab ts=2 sw=2 tw=80: */

/**
 * @fileoverview Deflate (RFC1951) 符号化アルゴリズム実装.
 */


/**
 * Raw Deflate 実装
 *
 * @constructor
 * @param {!(Array.<number>|Uint8Array)} input 符号化する対象のバッファ.
 * @param {Object=} opt_params option parameters.
 *
 * typed array が使用可能なとき、outputBuffer が Array は自動的に Uint8Array に
 * 変換されます.
 * 別のオブジェクトになるため出力バッファを参照している変数などは
 * 更新する必要があります.
 */
Zlib.RawDeflate = function(input, opt_params) {
  /** @type {Zlib.RawDeflate.CompressionType} */
  this.compressionType = Zlib.RawDeflate.CompressionType.DYNAMIC;
  /** @type {number} */
  this.lazy = 0;
  /** @type {!(Array.<number>|Uint32Array)} */
  this.freqsLitLen;
  /** @type {!(Array.<number>|Uint32Array)} */
  this.freqsDist;
  /** @type {!(Array.<number>|Uint8Array)} */
  this.input =
      ( input instanceof Array) ? new Uint8Array(input) : input;
  /** @type {!(Array.<number>|Uint8Array)} output output buffer. */
  this.output;
  /** @type {number} pos output buffer position. */
  this.op = 0;

  // option parameters
  if (opt_params) {
    if (opt_params['lazy']) {
      this.lazy = opt_params['lazy'];
    }
    if (typeof opt_params['compressionType'] === 'number') {
      this.compressionType = opt_params['compressionType'];
    }
    if (opt_params['outputBuffer']) {
      this.output =
          ( opt_params['outputBuffer'] instanceof Array) ?
              new Uint8Array(opt_params['outputBuffer']) : opt_params['outputBuffer'];
    }
    if (typeof opt_params['outputIndex'] === 'number') {
      this.op = opt_params['outputIndex'];
    }
  }

  if (!this.output) {
    this.output = new ( Uint8Array )(0x8000);
  }
};

/**
 * @enum {number}
 */
Zlib.RawDeflate.CompressionType = {
  NONE: 0,
  FIXED: 1,
  DYNAMIC: 2,
  RESERVED: 3
};


/**
 * LZ77 の最小マッチ長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.Lz77MinLength = 3;

/**
 * LZ77 の最大マッチ長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.Lz77MaxLength = 258;

/**
 * LZ77 のウィンドウサイズ
 * @const
 * @type {number}
 */
Zlib.RawDeflate.WindowSize = 0x8000;

/**
 * 最長の符号長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.MaxCodeLength = 16;

/**
 * ハフマン符号の最大数値
 * @const
 * @type {number}
 */
Zlib.RawDeflate.HUFMAX = 286;

/**
 * 固定ハフマン符号の符号化テーブル
 * @const
 * @type {Array.<Array.<number, number>>}
 */
Zlib.RawDeflate.FixedHuffmanTable = (function() {
  var table = [], i;

  for (i = 0; i < 288; i++) {
    switch (true) {
      case (i <= 143): table.push([i       + 0x030, 8]); break;
      case (i <= 255): table.push([i - 144 + 0x190, 9]); break;
      case (i <= 279): table.push([i - 256 + 0x000, 7]); break;
      case (i <= 287): table.push([i - 280 + 0x0C0, 8]); break;
      default:
        throw 'invalid literal: ' + i;
    }
  }

  return table;
})();

/**
 * DEFLATE ブロックの作成
 * @return {!(Array.<number>|Uint8Array)} 圧縮済み byte array.
 */
Zlib.RawDeflate.prototype.compress = function() {
  /** @type {!(Array.<number>|Uint8Array)} */
  var blockArray;
  /** @type {number} */
  var position;
  /** @type {number} */
  var length;

  var input = this.input;

  // compression
  switch (this.compressionType) {
    case Zlib.RawDeflate.CompressionType.NONE:
      // each 65535-Byte (length header: 16-bit)
      for (position = 0, length = input.length; position < length;) {
        blockArray = 
            input.subarray(position, position + 0xffff) ;
        position += blockArray.length;
        this.makeNocompressBlock(blockArray, (position === length));
      }
      break;
    case Zlib.RawDeflate.CompressionType.FIXED:
      this.output = this.makeFixedHuffmanBlock(input, true);
      this.op = this.output.length;
      break;
    case Zlib.RawDeflate.CompressionType.DYNAMIC:
      this.output = this.makeDynamicHuffmanBlock(input, true);
      this.op = this.output.length;
      break;
    default:
      throw 'invalid compression type';
  }

  return this.output;
};

/**
 * 非圧縮ブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 非圧縮ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeNocompressBlock =
    function(blockArray, isFinalBlock) {
      /** @type {number} */
      var bfinal;
      /** @type {Zlib.RawDeflate.CompressionType} */
      var btype;
      /** @type {number} */
      var len;
      /** @type {number} */
      var nlen;

      var output = this.output;
      var op = this.op;

      // expand buffer
      {
        output = new Uint8Array(this.output.buffer);
        while (output.length <= op + blockArray.length + 5) {
          output = new Uint8Array(output.length << 1);
        }
        output.set(this.output);
      }

      // header
      bfinal = isFinalBlock ? 1 : 0;
      btype = Zlib.RawDeflate.CompressionType.NONE;
      output[op++] = (bfinal) | (btype << 1);

      // length
      len = blockArray.length;
      nlen = (~len + 0x10000) & 0xffff;
      output[op++] =          len & 0xff;
      output[op++] =  (len >>> 8) & 0xff;
      output[op++] =         nlen & 0xff;
      output[op++] = (nlen >>> 8) & 0xff;

      // copy buffer
      {
        output.set(blockArray, op);
        op += blockArray.length;
        output = output.subarray(0, op);
      }

      this.op = op;
      this.output = output;

      return output;
    };

/**
 * 固定ハフマンブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 固定ハフマン符号化ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeFixedHuffmanBlock =
    function(blockArray, isFinalBlock) {
      /** @type {Zlib.BitStream} */
      var stream = new Zlib.BitStream(
          new Uint8Array(this.output.buffer) , this.op);
      /** @type {number} */
      var bfinal;
      /** @type {Zlib.RawDeflate.CompressionType} */
      var btype;
      /** @type {!(Array.<number>|Uint16Array)} */
      var data;

      // header
      bfinal = isFinalBlock ? 1 : 0;
      btype = Zlib.RawDeflate.CompressionType.FIXED;

      stream.writeBits(bfinal, 1, true);
      stream.writeBits(btype, 2, true);

      data = this.lz77(blockArray);
      this.fixedHuffman(data, stream);

      return stream.finish();
    };

/**
 * 動的ハフマンブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 動的ハフマン符号ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeDynamicHuffmanBlock =
    function(blockArray, isFinalBlock) {
      /** @type {Zlib.BitStream} */
      var stream = new Zlib.BitStream(
          new Uint8Array(this.output.buffer) , this.op);
      /** @type {number} */
      var bfinal;
      /** @type {Zlib.RawDeflate.CompressionType} */
      var btype;
      /** @type {!(Array.<number>|Uint16Array)} */
      var data;
      /** @type {number} */
      var hlit;
      /** @type {number} */
      var hdist;
      /** @type {number} */
      var hclen;
      /** @const @type {Array.<number>} */
      var hclenOrder =
          [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
      /** @type {!(Array.<number>|Uint8Array)} */
      var litLenLengths;
      /** @type {!(Array.<number>|Uint16Array)} */
      var litLenCodes;
      /** @type {!(Array.<number>|Uint8Array)} */
      var distLengths;
      /** @type {!(Array.<number>|Uint16Array)} */
      var distCodes;
      /** @type {{
       *   codes: !(Array.<number>|Uint32Array),
       *   freqs: !(Array.<number>|Uint8Array)
       * }} */
      var treeSymbols;
      /** @type {!(Array.<number>|Uint8Array)} */
      var treeLengths;
      /** @type {Array} */
      var transLengths = new Array(19);
      /** @type {!(Array.<number>|Uint16Array)} */
      var treeCodes;
      /** @type {number} */
      var code;
      /** @type {number} */
      var bitlen;
      /** @type {number} */
      var i;
      /** @type {number} */
      var il;

      // header
      bfinal = isFinalBlock ? 1 : 0;
      btype = Zlib.RawDeflate.CompressionType.DYNAMIC;

      stream.writeBits(bfinal, 1, true);
      stream.writeBits(btype, 2, true);

      data = this.lz77(blockArray);

      // リテラル・長さ, 距離のハフマン符号と符号長の算出
      litLenLengths = this.getLengths_(this.freqsLitLen, 15);
      litLenCodes = this.getCodesFromLengths_(litLenLengths);
      distLengths = this.getLengths_(this.freqsDist, 7);
      distCodes = this.getCodesFromLengths_(distLengths);

      // HLIT, HDIST の決定
      for (hlit = 286; hlit > 257 && litLenLengths[hlit - 1] === 0; hlit--) {}
      for (hdist = 30; hdist > 1 && distLengths[hdist - 1] === 0; hdist--) {}

      // HCLEN
      treeSymbols =
          this.getTreeSymbols_(hlit, litLenLengths, hdist, distLengths);
      treeLengths = this.getLengths_(treeSymbols.freqs, 7);
      for (i = 0; i < 19; i++) {
        transLengths[i] = treeLengths[hclenOrder[i]];
      }
      for (hclen = 19; hclen > 4 && transLengths[hclen - 1] === 0; hclen--) {}

      treeCodes = this.getCodesFromLengths_(treeLengths);

      // 出力
      stream.writeBits(hlit - 257, 5, true);
      stream.writeBits(hdist - 1, 5, true);
      stream.writeBits(hclen - 4, 4, true);
      for (i = 0; i < hclen; i++) {
        stream.writeBits(transLengths[i], 3, true);
      }

      // ツリーの出力
      for (i = 0, il = treeSymbols.codes.length; i < il; i++) {
        code = treeSymbols.codes[i];

        stream.writeBits(treeCodes[code], treeLengths[code], true);

        // extra bits
        if (code >= 16) {
          i++;
          switch (code) {
            case 16: bitlen = 2; break;
            case 17: bitlen = 3; break;
            case 18: bitlen = 7; break;
            default:
              throw 'invalid code: ' + code;
          }

          stream.writeBits(treeSymbols.codes[i], bitlen, true);
        }
      }

      this.dynamicHuffman(
          data,
          [litLenCodes, litLenLengths],
          [distCodes, distLengths],
          stream
      );

      return stream.finish();
    };


/**
 * 動的ハフマン符号化(カスタムハフマンテーブル)
 * @param {!(Array.<number>|Uint16Array)} dataArray LZ77 符号化済み byte array.
 * @param {!Zlib.BitStream} stream 書き込み用ビットストリーム.
 * @return {!Zlib.BitStream} ハフマン符号化済みビットストリームオブジェクト.
 */
Zlib.RawDeflate.prototype.dynamicHuffman =
    function(dataArray, litLen, dist, stream) {
      /** @type {number} */
      var index;
      /** @type {number} */
      var length;
      /** @type {number} */
      var literal;
      /** @type {number} */
      var code;
      /** @type {number} */
      var litLenCodes;
      /** @type {number} */
      var litLenLengths;
      /** @type {number} */
      var distCodes;
      /** @type {number} */
      var distLengths;

      litLenCodes = litLen[0];
      litLenLengths = litLen[1];
      distCodes = dist[0];
      distLengths = dist[1];

      // 符号を BitStream に書き込んでいく
      for (index = 0, length = dataArray.length; index < length; ++index) {
        literal = dataArray[index];

        // literal or length
        stream.writeBits(litLenCodes[literal], litLenLengths[literal], true);

        // 長さ・距離符号
        if (literal > 256) {
          // length extra
          stream.writeBits(dataArray[++index], dataArray[++index], true);
          // distance
          code = dataArray[++index];
          stream.writeBits(distCodes[code], distLengths[code], true);
          // distance extra
          stream.writeBits(dataArray[++index], dataArray[++index], true);
          // 終端
        } else if (literal === 256) {
          break;
        }
      }

      return stream;
    };

/**
 * 固定ハフマン符号化
 * @param {!(Array.<number>|Uint16Array)} dataArray LZ77 符号化済み byte array.
 * @param {!Zlib.BitStream} stream 書き込み用ビットストリーム.
 * @return {!Zlib.BitStream} ハフマン符号化済みビットストリームオブジェクト.
 */
Zlib.RawDeflate.prototype.fixedHuffman = function(dataArray, stream) {
  /** @type {number} */
  var index;
  /** @type {number} */
  var length;
  /** @type {number} */
  var literal;

  // 符号を BitStream に書き込んでいく
  for (index = 0, length = dataArray.length; index < length; index++) {
    literal = dataArray[index];

    // 符号の書き込み
    Zlib.BitStream.prototype.writeBits.apply(
        stream,
        Zlib.RawDeflate.FixedHuffmanTable[literal]
    );

    // 長さ・距離符号
    if (literal > 0x100) {
      // length extra
      stream.writeBits(dataArray[++index], dataArray[++index], true);
      // distance
      stream.writeBits(dataArray[++index], 5);
      // distance extra
      stream.writeBits(dataArray[++index], dataArray[++index], true);
      // 終端
    } else if (literal === 0x100) {
      break;
    }
  }

  return stream;
};

/**
 * マッチ情報
 * @param {!number} length マッチした長さ.
 * @param {!number} backwardDistance マッチ位置との距離.
 * @constructor
 */
Zlib.RawDeflate.Lz77Match = function(length, backwardDistance) {
  /** @type {number} match length. */
  this.length = length;
  /** @type {number} backward distance. */
  this.backwardDistance = backwardDistance;
};

/**
 * 長さ符号テーブル.
 * [コード, 拡張ビット, 拡張ビット長] の配列となっている.
 * @const
 * @type {!(Array.<number>|Uint32Array)}
 */
Zlib.RawDeflate.Lz77Match.LengthCodeTable = (function(table) {
  return  new Uint32Array(table) ;
})((function() {
  /** @type {!Array} */
  var table = [];
  /** @type {number} */
  var i;
  /** @type {!Array.<number>} */
  var c;

  for (i = 3; i <= 258; i++) {
    c = code(i);
    table[i] = (c[2] << 24) | (c[1] << 16) | c[0];
  }

  /**
   * @param {number} length lz77 length.
   * @return {!Array.<number>} lz77 codes.
   */
  function code(length) {
    switch (true) {
      case (length === 3): return [257, length - 3, 0];      case (length === 4): return [258, length - 4, 0];      case (length === 5): return [259, length - 5, 0];      case (length === 6): return [260, length - 6, 0];      case (length === 7): return [261, length - 7, 0];      case (length === 8): return [262, length - 8, 0];      case (length === 9): return [263, length - 9, 0];      case (length === 10): return [264, length - 10, 0];      case (length <= 12): return [265, length - 11, 1];      case (length <= 14): return [266, length - 13, 1];      case (length <= 16): return [267, length - 15, 1];      case (length <= 18): return [268, length - 17, 1];      case (length <= 22): return [269, length - 19, 2];      case (length <= 26): return [270, length - 23, 2];      case (length <= 30): return [271, length - 27, 2];      case (length <= 34): return [272, length - 31, 2];      case (length <= 42): return [273, length - 35, 3];      case (length <= 50): return [274, length - 43, 3];      case (length <= 58): return [275, length - 51, 3];      case (length <= 66): return [276, length - 59, 3];      case (length <= 82): return [277, length - 67, 4];      case (length <= 98): return [278, length - 83, 4];      case (length <= 114): return [279, length - 99, 4];      case (length <= 130): return [280, length - 115, 4];      case (length <= 162): return [281, length - 131, 5];      case (length <= 194): return [282, length - 163, 5];      case (length <= 226): return [283, length - 195, 5];      case (length <= 257): return [284, length - 227, 5];      case (length === 258): return [285, length - 258, 0];      default: throw 'invalid length: ' + length;
    }
  }

  return table;
})());

/**
 * 距離符号テーブル
 * @param {!number} dist 距離.
 * @return {!Array.<number>} コード、拡張ビット、拡張ビット長の配列.
 * @private
 */
Zlib.RawDeflate.Lz77Match.prototype.getDistanceCode_ = function(dist) {
  /** @type {!Array.<number>} distance code table. */
  var r;

  switch (true) {
    case (dist === 1): r = [0, dist - 1, 0]; break;
    case (dist === 2): r = [1, dist - 2, 0]; break;
    case (dist === 3): r = [2, dist - 3, 0]; break;
    case (dist === 4): r = [3, dist - 4, 0]; break;
    case (dist <= 6): r = [4, dist - 5, 1]; break;
    case (dist <= 8): r = [5, dist - 7, 1]; break;
    case (dist <= 12): r = [6, dist - 9, 2]; break;
    case (dist <= 16): r = [7, dist - 13, 2]; break;
    case (dist <= 24): r = [8, dist - 17, 3]; break;
    case (dist <= 32): r = [9, dist - 25, 3]; break;
    case (dist <= 48): r = [10, dist - 33, 4]; break;
    case (dist <= 64): r = [11, dist - 49, 4]; break;
    case (dist <= 96): r = [12, dist - 65, 5]; break;
    case (dist <= 128): r = [13, dist - 97, 5]; break;
    case (dist <= 192): r = [14, dist - 129, 6]; break;
    case (dist <= 256): r = [15, dist - 193, 6]; break;
    case (dist <= 384): r = [16, dist - 257, 7]; break;
    case (dist <= 512): r = [17, dist - 385, 7]; break;
    case (dist <= 768): r = [18, dist - 513, 8]; break;
    case (dist <= 1024): r = [19, dist - 769, 8]; break;
    case (dist <= 1536): r = [20, dist - 1025, 9]; break;
    case (dist <= 2048): r = [21, dist - 1537, 9]; break;
    case (dist <= 3072): r = [22, dist - 2049, 10]; break;
    case (dist <= 4096): r = [23, dist - 3073, 10]; break;
    case (dist <= 6144): r = [24, dist - 4097, 11]; break;
    case (dist <= 8192): r = [25, dist - 6145, 11]; break;
    case (dist <= 12288): r = [26, dist - 8193, 12]; break;
    case (dist <= 16384): r = [27, dist - 12289, 12]; break;
    case (dist <= 24576): r = [28, dist - 16385, 13]; break;
    case (dist <= 32768): r = [29, dist - 24577, 13]; break;
    default: throw 'invalid distance';
  }

  return r;
};

/**
 * マッチ情報を LZ77 符号化配列で返す.
 * なお、ここでは以下の内部仕様で符号化している
 * [ CODE, EXTRA-BIT-LEN, EXTRA, CODE, EXTRA-BIT-LEN, EXTRA ]
 * @return {!Array.<number>} LZ77 符号化 byte array.
 */
Zlib.RawDeflate.Lz77Match.prototype.toLz77Array = function() {
  /** @type {number} */
  var length = this.length;
  /** @type {number} */
  var dist = this.backwardDistance;
  /** @type {Array} */
  var codeArray = [];
  /** @type {number} */
  var pos = 0;
  /** @type {!Array.<number>} */
  var code;

  // length
  code = Zlib.RawDeflate.Lz77Match.LengthCodeTable[length];
  codeArray[pos++] = code & 0xffff;
  codeArray[pos++] = (code >> 16) & 0xff;
  codeArray[pos++] = code >> 24;

  // distance
  code = this.getDistanceCode_(dist);
  codeArray[pos++] = code[0];
  codeArray[pos++] = code[1];
  codeArray[pos++] = code[2];

  return codeArray;
};

/**
 * LZ77 実装
 * @param {!(Array.<number>|Uint8Array)} dataArray LZ77 符号化するバイト配列.
 * @return {!(Array.<number>|Uint16Array)} LZ77 符号化した配列.
 */
Zlib.RawDeflate.prototype.lz77 = function(dataArray) {
  /** @type {number} input position */
  var position;
  /** @type {number} input length */
  var length;
  /** @type {number} loop counter */
  var i;
  /** @type {number} loop limiter */
  var il;
  /** @type {number} chained-hash-table key */
  var matchKey;
  /** @type {Object.<number, Array.<number>>} chained-hash-table */
  var table = {};
  /** @const @type {number} */
  var windowSize = Zlib.RawDeflate.WindowSize;
  /** @type {Array.<number>} match list */
  var matchList;
  /** @type {Zlib.RawDeflate.Lz77Match} longest match */
  var longestMatch;
  /** @type {Zlib.RawDeflate.Lz77Match} previous longest match */
  var prevMatch;
  /** @type {!(Array.<number>|Uint16Array)} lz77 buffer */
  var lz77buf = 
      new Uint16Array(dataArray.length * 2) ;
  /** @type {number} lz77 output buffer pointer */
  var pos = 0;
  /** @type {number} lz77 skip length */
  var skipLength = 0;
  /** @type {!(Array.<number>|Uint32Array)} */
  var freqsLitLen = new ( Uint32Array )(286);
  /** @type {!(Array.<number>|Uint32Array)} */
  var freqsDist = new ( Uint32Array )(30);
  /** @type {number} */
  var lazy = this.lazy;
  /** @type {*} temporary variable */
  var tmp;
  freqsLitLen[256] = 1; // EOB の最低出現回数は 1

  /**
   * マッチデータの書き込み
   * @param {Zlib.RawDeflate.Lz77Match} match LZ77 Match data.
   * @param {!number} offset スキップ開始位置(相対指定).
   * @private
   */
  function writeMatch(match, offset) {
    /** @type {Array.<number>} */
    var lz77Array = match.toLz77Array();
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    for (i = 0, il = lz77Array.length; i < il; ++i) {
      lz77buf[pos++] = lz77Array[i];
    }
    freqsLitLen[lz77Array[0]]++;
    freqsDist[lz77Array[3]]++;
    skipLength = match.length + offset - 1;
    prevMatch = null;
  }

  // LZ77 符号化
  for (position = 0, length = dataArray.length; position < length; ++position) {
    // ハッシュキーの作成
    for (matchKey = 0, i = 0, il = Zlib.RawDeflate.Lz77MinLength; i < il; ++i) {
      if (position + i === length) {
        break;
      }
      matchKey = (matchKey << 8) | dataArray[position + i];
    }

    // テーブルが未定義だったら作成する
    if (table[matchKey] === void 0) { table[matchKey] = []; }
    matchList = table[matchKey];

    // skip
    if (skipLength-- > 0) {
      matchList.push(position);
      continue;
    }

    // マッチテーブルの更新 (最大戻り距離を超えているものを削除する)
    while (matchList.length > 0 && position - matchList[0] > windowSize) {
      matchList.shift();
    }

    // データ末尾でマッチしようがない場合はそのまま流しこむ
    if (position + Zlib.RawDeflate.Lz77MinLength >= length) {
      if (prevMatch) {
        writeMatch(prevMatch, -1);
      }

      for (i = 0, il = length - position; i < il; ++i) {
        tmp = dataArray[position + i];
        lz77buf[pos++] = tmp;
        ++freqsLitLen[tmp];
      }
      break;
    }

    // マッチ候補から最長のものを探す
    if (matchList.length > 0) {
      longestMatch = this.searchLongestMatch_(dataArray, position, matchList);

      if (prevMatch) {
        // 現在のマッチの方が前回のマッチよりも長い
        if (prevMatch.length < longestMatch.length) {
          // write previous literal
          tmp = dataArray[position - 1];
          lz77buf[pos++] = tmp;
          ++freqsLitLen[tmp];

          // write current match
          writeMatch(longestMatch, 0);
        } else {
          // write previous match
          writeMatch(prevMatch, -1);
        }
      } else if (longestMatch.length < lazy) {
        prevMatch = longestMatch;
      } else {
        writeMatch(longestMatch, 0);
      }
      // 前回マッチしていて今回マッチがなかったら前回のを採用
    } else if (prevMatch) {
      writeMatch(prevMatch, -1);
    } else {
      tmp = dataArray[position];
      lz77buf[pos++] = tmp;
      ++freqsLitLen[tmp];
    }

    matchList.push(position); // マッチテーブルに現在の位置を保存
  }

  // 終端処理
  lz77buf[pos++] = 256;
  freqsLitLen[256]++;
  this.freqsLitLen = freqsLitLen;
  this.freqsDist = freqsDist;

  return /** @type {!(Uint16Array|Array.<number>)} */ (
        lz77buf.subarray(0, pos) 
  );
};

/**
 * マッチした候補の中から最長一致を探す
 * @param {!Object} data plain data byte array.
 * @param {!number} position plain data byte array position.
 * @param {!Array.<number>} matchList 候補となる位置の配列.
 * @return {!Zlib.RawDeflate.Lz77Match} 最長かつ最短距離のマッチオブジェクト.
 * @private
 */
Zlib.RawDeflate.prototype.searchLongestMatch_ =
    function(data, position, matchList) {
      var match,
          currentMatch,
          matchMax = 0, matchLength,
          i, j, l, dl = data.length;

      // 候補を後ろから 1 つずつ絞り込んでゆく
      permatch:
          for (i = 0, l = matchList.length; i < l; i++) {
            match = matchList[l - i - 1];
            matchLength = Zlib.RawDeflate.Lz77MinLength;

            // 前回までの最長一致を末尾から一致検索する
            if (matchMax > Zlib.RawDeflate.Lz77MinLength) {
              for (j = matchMax; j > Zlib.RawDeflate.Lz77MinLength; j--) {
                if (data[match + j - 1] !== data[position + j - 1]) {
                  continue permatch;
                }
              }
              matchLength = matchMax;
            }

            // 最長一致探索
            while (matchLength < Zlib.RawDeflate.Lz77MaxLength &&
            position + matchLength < dl &&
            data[match + matchLength] === data[position + matchLength]) {
              ++matchLength;
            }

            // マッチ長が同じ場合は後方を優先
            if (matchLength > matchMax) {
              currentMatch = match;
              matchMax = matchLength;
            }

            // 最長が確定したら後の処理は省略
            if (matchLength === Zlib.RawDeflate.Lz77MaxLength) {
              break;
            }
          }

      return new Zlib.RawDeflate.Lz77Match(matchMax, position - currentMatch);
    };

/**
 * Tree-Transmit Symbols の算出
 * reference: PuTTY Deflate implementation
 * @param {number} hlit HLIT.
 * @param {!(Array.<number>|Uint8Array)} litlenLengths リテラルと長さ符号の符号長配列.
 * @param {number} hdist HDIST.
 * @param {!(Array.<number>|Uint8Array)} distLengths 距離符号の符号長配列.
 * @return {{
 *   codes: !(Array.<number>|Uint32Array),
 *   freqs: !(Array.<number>|Uint8Array)
 * }} Tree-Transmit Symbols.
 */
Zlib.RawDeflate.prototype.getTreeSymbols_ =
    function(hlit, litlenLengths, hdist, distLengths) {
      var src = new ( Uint32Array )(hlit + hdist),
          i, j, runLength, l,
          result = new ( Uint32Array )(286 + 30),
          nResult,
          rpt,
          freqs = new ( Uint8Array )(19);

      j = 0;
      for (i = 0; i < hlit; i++) {
        src[j++] = litlenLengths[i];
      }
      for (i = 0; i < hdist; i++) {
        src[j++] = distLengths[i];
      }

      // 符号化
      nResult = 0;
      for (i = 0, l = src.length; i < l; i += j) {
        // Run Length Encoding
        for (j = 1; i + j < l && src[i + j] === src[i]; ++j) {}

        runLength = j;

        if (src[i] === 0) {
          // 0 の繰り返しが 3 回未満ならばそのまま
          if (runLength < 3) {
            while (runLength-- > 0) {
              result[nResult++] = 0;
              freqs[0]++;
            }
          } else {
            while (runLength > 0) {
              // 繰り返しは最大 138 までなので切り詰める
              rpt = (runLength < 138 ? runLength : 138);

              if (rpt > runLength - 3 && rpt < runLength) {
                rpt = runLength - 3;
              }

              // 3-10 回 -> 17
              if (rpt <= 10) {
                result[nResult++] = 17;
                result[nResult++] = rpt - 3;
                freqs[17]++;
                // 11-138 回 -> 18
              } else {
                result[nResult++] = 18;
                result[nResult++] = rpt - 11;
                freqs[18]++;
              }

              runLength -= rpt;
            }
          }
        } else {
          result[nResult++] = src[i];
          freqs[src[i]]++;
          runLength--;

          // 繰り返し回数が3回未満ならばランレングス符号は要らない
          if (runLength < 3) {
            while (runLength-- > 0) {
              result[nResult++] = src[i];
              freqs[src[i]]++;
            }
            // 3 回以上ならばランレングス符号化
          } else {
            while (runLength > 0) {
              // runLengthを 3-6 で分割
              rpt = (runLength < 6 ? runLength : 6);

              if (rpt > runLength - 3 && rpt < runLength) {
                rpt = runLength - 3;
              }

              result[nResult++] = 16;
              result[nResult++] = rpt - 3;
              freqs[16]++;

              runLength -= rpt;
            }
          }
        }
      }

      return {
        codes:
             result.subarray(0, nResult) ,
        freqs: freqs
      };
    };

/**
 * ハフマン符号の長さを取得する
 * @param {!(Array.<number>|Uint8Array|Uint32Array)} freqs 出現カウント.
 * @param {number} limit 符号長の制限.
 * @return {!(Array.<number>|Uint8Array)} 符号長配列.
 * @private
 */
Zlib.RawDeflate.prototype.getLengths_ = function(freqs, limit) {
  /** @type {number} */
  var nSymbols = freqs.length;
  /** @type {Zlib.Heap} */
  var heap = new Zlib.Heap(2 * Zlib.RawDeflate.HUFMAX);
  /** @type {!(Array.<number>|Uint8Array)} */
  var length = new ( Uint8Array )(nSymbols);
  /** @type {Array} */
  var nodes;
  /** @type {!(Array.<number>|Uint32Array)} */
  var values;
  /** @type {!(Array.<number>|Uint8Array)} */
  var codeLength;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  // ヒープの構築
  for (i = 0; i < nSymbols; ++i) {
    if (freqs[i] > 0) {
      heap.push(i, freqs[i]);
    }
  }
  nodes = new Array(heap.length / 2);
  values = new ( Uint32Array )(heap.length / 2);

  // 非 0 の要素が一つだけだった場合は、そのシンボルに符号長 1 を割り当てて終了
  if (nodes.length === 1) {
    length[heap.pop().index] = 1;
    return length;
  }

  // Reverse Package Merge Algorithm による Canonical Huffman Code の符号長決定
  for (i = 0, il = heap.length / 2; i < il; ++i) {
    nodes[i] = heap.pop();
    values[i] = nodes[i].value;
  }
  codeLength = this.reversePackageMerge_(values, values.length, limit);

  for (i = 0, il = nodes.length; i < il; ++i) {
    length[nodes[i].index] = codeLength[i];
  }

  return length;
};

/**
 * Reverse Package Merge Algorithm.
 * @param {!(Array.<number>|Uint32Array)} freqs sorted probability.
 * @param {number} symbols number of symbols.
 * @param {number} limit code length limit.
 * @return {!(Array.<number>|Uint8Array)} code lengths.
 */
Zlib.RawDeflate.prototype.reversePackageMerge_ = function(freqs, symbols, limit) {
  /** @type {!(Array.<number>|Uint16Array)} */
  var minimumCost = new ( Uint16Array )(limit);
  /** @type {!(Array.<number>|Uint8Array)} */
  var flag = new ( Uint8Array )(limit);
  /** @type {!(Array.<number>|Uint8Array)} */
  var codeLength = new ( Uint8Array )(symbols);
  /** @type {Array} */
  var value = new Array(limit);
  /** @type {Array} */
  var type  = new Array(limit);
  /** @type {Array.<number>} */
  var currentPosition = new Array(limit);
  /** @type {number} */
  var excess = (1 << limit) - symbols;
  /** @type {number} */
  var half = (1 << (limit - 1));
  /** @type {number} */
  var i;
  /** @type {number} */
  var j;
  /** @type {number} */
  var t;
  /** @type {number} */
  var weight;
  /** @type {number} */
  var next;

  /**
   * @param {number} j
   */
  function takePackage(j) {
    /** @type {number} */
    var x = type[j][currentPosition[j]];

    if (x === symbols) {
      takePackage(j+1);
      takePackage(j+1);
    } else {
      --codeLength[x];
    }

    ++currentPosition[j];
  }

  minimumCost[limit-1] = symbols;

  for (j = 0; j < limit; ++j) {
    if (excess < half) {
      flag[j] = 0;
    } else {
      flag[j] = 1;
      excess -= half;
    }
    excess <<= 1;
    minimumCost[limit-2-j] = (minimumCost[limit-1-j] / 2 | 0) + symbols;
  }
  minimumCost[0] = flag[0];

  value[0] = new Array(minimumCost[0]);
  type[0]  = new Array(minimumCost[0]);
  for (j = 1; j < limit; ++j) {
    if (minimumCost[j] > 2 * minimumCost[j-1] + flag[j]) {
      minimumCost[j] = 2 * minimumCost[j-1] + flag[j];
    }
    value[j] = new Array(minimumCost[j]);
    type[j]  = new Array(minimumCost[j]);
  }

  for (i = 0; i < symbols; ++i) {
    codeLength[i] = limit;
  }

  for (t = 0; t < minimumCost[limit-1]; ++t) {
    value[limit-1][t] = freqs[t];
    type[limit-1][t]  = t;
  }

  for (i = 0; i < limit; ++i) {
    currentPosition[i] = 0;
  }
  if (flag[limit-1] === 1) {
    --codeLength[0];
    ++currentPosition[limit-1];
  }

  for (j = limit-2; j >= 0; --j) {
    i = 0;
    weight = 0;
    next = currentPosition[j+1];

    for (t = 0; t < minimumCost[j]; t++) {
      weight = value[j+1][next] + value[j+1][next+1];

      if (weight > freqs[i]) {
        value[j][t] = weight;
        type[j][t] = symbols;
        next += 2;
      } else {
        value[j][t] = freqs[i];
        type[j][t] = i;
        ++i;
      }
    }

    currentPosition[j] = 0;
    if (flag[j] === 1) {
      takePackage(j);
    }
  }

  return codeLength;
};

/**
 * 符号長配列からハフマン符号を取得する
 * reference: PuTTY Deflate implementation
 * @param {!(Array.<number>|Uint8Array)} lengths 符号長配列.
 * @return {!(Array.<number>|Uint16Array)} ハフマン符号配列.
 * @private
 */
Zlib.RawDeflate.prototype.getCodesFromLengths_ = function(lengths) {
  var codes = new ( Uint16Array )(lengths.length),
      count = [],
      startCode = [],
      code = 0, i, il, j, m;

  // Count the codes of each length.
  for (i = 0, il = lengths.length; i < il; i++) {
    count[lengths[i]] = (count[lengths[i]] | 0) + 1;
  }

  // Determine the starting code for each length block.
  for (i = 1, il = Zlib.RawDeflate.MaxCodeLength; i <= il; i++) {
    startCode[i] = code;
    code += count[i] | 0;
    code <<= 1;
  }

  // Determine the code for each symbol. Mirrored, of course.
  for (i = 0, il = lengths.length; i < il; i++) {
    code = startCode[lengths[i]];
    startCode[lengths[i]] += 1;
    codes[i] = 0;

    for (j = 0, m = lengths[i]; j < m; j++) {
      codes[i] = (codes[i] << 1) | (code & 1);
      code >>>= 1;
    }
  }

  return codes;
};


/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {Object=} opt_params options.
 * @constructor
 */
Zlib.Unzip = function(input, opt_params) {
  opt_params = opt_params || {};
  /** @type {!(Array.<number>|Uint8Array)} */
  this.input =
      ( (input instanceof Array)) ?
          new Uint8Array(input) : input;
  /** @type {number} */
  this.ip = 0;
  /** @type {number} */
  this.eocdrOffset;
  /** @type {number} */
  this.numberOfThisDisk;
  /** @type {number} */
  this.startDisk;
  /** @type {number} */
  this.totalEntriesThisDisk;
  /** @type {number} */
  this.totalEntries;
  /** @type {number} */
  this.centralDirectorySize;
  /** @type {number} */
  this.centralDirectoryOffset;
  /** @type {number} */
  this.commentLength;
  /** @type {(Array.<number>|Uint8Array)} */
  this.comment;
  /** @type {Array.<Zlib.Unzip.FileHeader>} */
  this.fileHeaderList;
  /** @type {Object.<string, number>} */
  this.filenameToIndex;
  /** @type {boolean} */
  this.verify = opt_params['verify'] || false;
  /** @type {(Array.<number>|Uint8Array)} */
  this.password = opt_params['password'];
};

Zlib.Unzip.CompressionMethod = Zlib.Zip.CompressionMethod;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.FileHeaderSignature = Zlib.Zip.FileHeaderSignature;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.LocalFileHeaderSignature = Zlib.Zip.LocalFileHeaderSignature;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.CentralDirectorySignature = Zlib.Zip.CentralDirectorySignature;

/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {number} ip input position.
 * @constructor
 */
Zlib.Unzip.FileHeader = function(input, ip) {
  /** @type {!(Array.<number>|Uint8Array)} */
  this.input = input;
  /** @type {number} */
  this.offset = ip;
  /** @type {number} */
  this.length;
  /** @type {number} */
  this.version;
  /** @type {number} */
  this.os;
  /** @type {number} */
  this.needVersion;
  /** @type {number} */
  this.flags;
  /** @type {number} */
  this.compression;
  /** @type {number} */
  this.time;
  /** @type {number} */
  this.date;
  /** @type {number} */
  this.crc32;
  /** @type {number} */
  this.compressedSize;
  /** @type {number} */
  this.plainSize;
  /** @type {number} */
  this.fileNameLength;
  /** @type {number} */
  this.extraFieldLength;
  /** @type {number} */
  this.fileCommentLength;
  /** @type {number} */
  this.diskNumberStart;
  /** @type {number} */
  this.internalFileAttributes;
  /** @type {number} */
  this.externalFileAttributes;
  /** @type {number} */
  this.relativeOffset;
  /** @type {string} */
  this.filename;
  /** @type {!(Array.<number>|Uint8Array)} */
  this.extraField;
  /** @type {!(Array.<number>|Uint8Array)} */
  this.comment;
};

Zlib.Unzip.FileHeader.prototype.parse = function() {
  /** @type {!(Array.<number>|Uint8Array)} */
  var input = this.input;
  /** @type {number} */
  var ip = this.offset;

  // central file header signature
  if (input[ip++] !== Zlib.Unzip.FileHeaderSignature[0] ||
      input[ip++] !== Zlib.Unzip.FileHeaderSignature[1] ||
      input[ip++] !== Zlib.Unzip.FileHeaderSignature[2] ||
      input[ip++] !== Zlib.Unzip.FileHeaderSignature[3]) {
    throw new Error('invalid file header signature');
  }

  // version made by
  this.version = input[ip++];
  this.os = input[ip++];

  // version needed to extract
  this.needVersion = input[ip++] | (input[ip++] << 8);

  // general purpose bit flag
  this.flags = input[ip++] | (input[ip++] << 8);

  // compression method
  this.compression = input[ip++] | (input[ip++] << 8);

  // last mod file time
  this.time = input[ip++] | (input[ip++] << 8);

  //last mod file date
  this.date = input[ip++] | (input[ip++] << 8);

  // crc-32
  this.crc32 = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // compressed size
  this.compressedSize = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // uncompressed size
  this.plainSize = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // file name length
  this.fileNameLength = input[ip++] | (input[ip++] << 8);

  // extra field length
  this.extraFieldLength = input[ip++] | (input[ip++] << 8);

  // file comment length
  this.fileCommentLength = input[ip++] | (input[ip++] << 8);

  // disk number start
  this.diskNumberStart = input[ip++] | (input[ip++] << 8);

  // internal file attributes
  this.internalFileAttributes = input[ip++] | (input[ip++] << 8);

  // external file attributes
  this.externalFileAttributes =
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24);

  // relative offset of local header
  this.relativeOffset = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // file name
  this.filename = String.fromCharCode.apply(null, 
      input.subarray(ip, ip += this.fileNameLength) 
  );

  // extra field
  this.extraField = 
      input.subarray(ip, ip += this.extraFieldLength) ;

  // file comment
  this.comment = 
      input.subarray(ip, ip + this.fileCommentLength) ;

  this.length = ip - this.offset;
};

/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {number} ip input position.
 * @constructor
 */
Zlib.Unzip.LocalFileHeader = function(input, ip) {
  /** @type {!(Array.<number>|Uint8Array)} */
  this.input = input;
  /** @type {number} */
  this.offset = ip;
  /** @type {number} */
  this.length;
  /** @type {number} */
  this.needVersion;
  /** @type {number} */
  this.flags;
  /** @type {number} */
  this.compression;
  /** @type {number} */
  this.time;
  /** @type {number} */
  this.date;
  /** @type {number} */
  this.crc32;
  /** @type {number} */
  this.compressedSize;
  /** @type {number} */
  this.plainSize;
  /** @type {number} */
  this.fileNameLength;
  /** @type {number} */
  this.extraFieldLength;
  /** @type {string} */
  this.filename;
  /** @type {!(Array.<number>|Uint8Array)} */
  this.extraField;
};

Zlib.Unzip.LocalFileHeader.Flags = Zlib.Zip.Flags;

Zlib.Unzip.LocalFileHeader.prototype.parse = function() {
  /** @type {!(Array.<number>|Uint8Array)} */
  var input = this.input;
  /** @type {number} */
  var ip = this.offset;

  // local file header signature
  if (input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[0] ||
      input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[1] ||
      input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[2] ||
      input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[3]) {
    throw new Error('invalid local file header signature');
  }

  // version needed to extract
  this.needVersion = input[ip++] | (input[ip++] << 8);

  // general purpose bit flag
  this.flags = input[ip++] | (input[ip++] << 8);

  // compression method
  this.compression = input[ip++] | (input[ip++] << 8);

  // last mod file time
  this.time = input[ip++] | (input[ip++] << 8);

  //last mod file date
  this.date = input[ip++] | (input[ip++] << 8);

  // crc-32
  this.crc32 = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // compressed size
  this.compressedSize = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // uncompressed size
  this.plainSize = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // file name length
  this.fileNameLength = input[ip++] | (input[ip++] << 8);

  // extra field length
  this.extraFieldLength = input[ip++] | (input[ip++] << 8);

  // file name
  this.filename = String.fromCharCode.apply(null, 
      input.subarray(ip, ip += this.fileNameLength) 
  );

  // extra field
  this.extraField = 
      input.subarray(ip, ip += this.extraFieldLength) ;

  this.length = ip - this.offset;
};


Zlib.Unzip.prototype.searchEndOfCentralDirectoryRecord = function() {
  /** @type {!(Array.<number>|Uint8Array)} */
  var input = this.input;
  /** @type {number} */
  var ip;

  for (ip = input.length - 12; ip > 0; --ip) {
    if (input[ip  ] === Zlib.Unzip.CentralDirectorySignature[0] &&
        input[ip+1] === Zlib.Unzip.CentralDirectorySignature[1] &&
        input[ip+2] === Zlib.Unzip.CentralDirectorySignature[2] &&
        input[ip+3] === Zlib.Unzip.CentralDirectorySignature[3]) {
      this.eocdrOffset = ip;
      return;
    }
  }

  throw new Error('End of Central Directory Record not found');
};

Zlib.Unzip.prototype.parseEndOfCentralDirectoryRecord = function() {
  /** @type {!(Array.<number>|Uint8Array)} */
  var input = this.input;
  /** @type {number} */
  var ip;

  if (!this.eocdrOffset) {
    this.searchEndOfCentralDirectoryRecord();
  }
  ip = this.eocdrOffset;

  // signature
  if (input[ip++] !== Zlib.Unzip.CentralDirectorySignature[0] ||
      input[ip++] !== Zlib.Unzip.CentralDirectorySignature[1] ||
      input[ip++] !== Zlib.Unzip.CentralDirectorySignature[2] ||
      input[ip++] !== Zlib.Unzip.CentralDirectorySignature[3]) {
    throw new Error('invalid signature');
  }

  // number of this disk
  this.numberOfThisDisk = input[ip++] | (input[ip++] << 8);

  // number of the disk with the start of the central directory
  this.startDisk = input[ip++] | (input[ip++] << 8);

  // total number of entries in the central directory on this disk
  this.totalEntriesThisDisk = input[ip++] | (input[ip++] << 8);

  // total number of entries in the central directory
  this.totalEntries = input[ip++] | (input[ip++] << 8);

  // size of the central directory
  this.centralDirectorySize = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // offset of start of central directory with respect to the starting disk number
  this.centralDirectoryOffset = (
      (input[ip++]      ) | (input[ip++] <<  8) |
      (input[ip++] << 16) | (input[ip++] << 24)
  ) >>> 0;

  // .ZIP file comment length
  this.commentLength = input[ip++] | (input[ip++] << 8);

  // .ZIP file comment
  this.comment = 
      input.subarray(ip, ip + this.commentLength) ;
};

Zlib.Unzip.prototype.parseFileHeader = function() {
  /** @type {Array.<Zlib.Unzip.FileHeader>} */
  var filelist = [];
  /** @type {Object.<string, number>} */
  var filetable = {};
  /** @type {number} */
  var ip;
  /** @type {Zlib.Unzip.FileHeader} */
  var fileHeader;
  /*: @type {number} */
  var i;
  /*: @type {number} */
  var il;

  if (this.fileHeaderList) {
    return;
  }

  if (this.centralDirectoryOffset === void 0) {
    this.parseEndOfCentralDirectoryRecord();
  }
  ip = this.centralDirectoryOffset;

  for (i = 0, il = this.totalEntries; i < il; ++i) {
    fileHeader = new Zlib.Unzip.FileHeader(this.input, ip);
    fileHeader.parse();
    ip += fileHeader.length;
    filelist[i] = fileHeader;
    filetable[fileHeader.filename] = i;
  }

  if (this.centralDirectorySize < ip - this.centralDirectoryOffset) {
    throw new Error('invalid file header size');
  }

  this.fileHeaderList = filelist;
  this.filenameToIndex = filetable;
};

/**
 * @param {number} index file header index.
 * @param {Object=} opt_params
 * @return {!(Array.<number>|Uint8Array)} file data.
 */
Zlib.Unzip.prototype.getFileData = function(index, opt_params) {
  opt_params = opt_params || {};
  /** @type {!(Array.<number>|Uint8Array)} */
  var input = this.input;
  /** @type {Array.<Zlib.Unzip.FileHeader>} */
  var fileHeaderList = this.fileHeaderList;
  /** @type {Zlib.Unzip.LocalFileHeader} */
  var localFileHeader;
  /** @type {number} */
  var offset;
  /** @type {number} */
  var length;
  /** @type {!(Array.<number>|Uint8Array)} */
  var buffer;
  /** @type {number} */
  var crc32;
  /** @type {Array.<number>|Uint32Array|Object} */
  var key;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  if (!fileHeaderList) {
    this.parseFileHeader();
  }

  if (fileHeaderList[index] === void 0) {
    throw new Error('wrong index');
  }

  offset = fileHeaderList[index].relativeOffset;
  localFileHeader = new Zlib.Unzip.LocalFileHeader(this.input, offset);
  localFileHeader.parse();
  offset += localFileHeader.length;
  length = localFileHeader.compressedSize;

  // decryption
  if ((localFileHeader.flags & Zlib.Unzip.LocalFileHeader.Flags.ENCRYPT) !== 0) {
    if (!(opt_params['password'] || this.password)) {
      throw new Error('please set password');
    }
    key =  this.createDecryptionKey(opt_params['password'] || this.password);

    // encryption header
    for(i = offset, il = offset + 12; i < il; ++i) {
      this.decode(key, input[i]);
    }
    offset += 12;
    length -= 12;

    // decryption
    for (i = offset, il = offset + length; i < il; ++i) {
      input[i] = this.decode(key, input[i]);
    }
  }

  switch (localFileHeader.compression) {
    case Zlib.Unzip.CompressionMethod.STORE:
      buffer = 
          this.input.subarray(offset, offset + length) ;
      break;
    case Zlib.Unzip.CompressionMethod.DEFLATE:
      buffer = new Zlib.RawInflate(this.input, {
        'index': offset,
        'bufferSize': localFileHeader.plainSize
      }).decompress();
      break;
    default:
      throw new Error('unknown compression type');
  }

  if (this.verify) {
    crc32 = Zlib.CRC32.calc(buffer);
    if (localFileHeader.crc32 !== crc32) {
      throw new Error(
          'wrong crc: file=0x' + localFileHeader.crc32.toString(16) +
          ', data=0x' + crc32.toString(16)
      );
    }
  }

  return buffer;
};

/**
 * @return {Array.<string>}
 */
Zlib.Unzip.prototype.getFilenames = function() {
  /** @type {Array.<string>} */
  var filenameList = [];
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {Array.<Zlib.Unzip.FileHeader>} */
  var fileHeaderList;

  if (!this.fileHeaderList) {
    this.parseFileHeader();
  }
  fileHeaderList = this.fileHeaderList;

  for (i = 0, il = fileHeaderList.length; i < il; ++i) {
    filenameList[i] = fileHeaderList[i].filename;
  }

  return filenameList;
};

/**
 * @param {string} filename extract filename.
 * @param {Object=} opt_params
 * @return {!(Array.<number>|Uint8Array)} decompressed data.
 */
Zlib.Unzip.prototype.decompress = function(filename, opt_params) {
  /** @type {number} */
  var index;

  if (!this.filenameToIndex) {
    this.parseFileHeader();
  }
  index = this.filenameToIndex[filename];

  if (index === void 0) {
    throw new Error(filename + ' not found');
  }

  return this.getFileData(index, opt_params);
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 */
Zlib.Unzip.prototype.setPassword = function(password) {
  this.password = password;
};

/**
 * @param {(Array.<number>|Uint32Array|Object)} key
 * @param {number} n
 * @return {number}
 */
Zlib.Unzip.prototype.decode = function(key, n) {
  n ^= this.getByte(/** @type {(Array.<number>|Uint32Array)} */(key));
  this.updateKeys(/** @type {(Array.<number>|Uint32Array)} */(key), n);

  return n;
};

// common method
Zlib.Unzip.prototype.updateKeys = Zlib.Zip.prototype.updateKeys;
Zlib.Unzip.prototype.createDecryptionKey = Zlib.Zip.prototype.createEncryptionKey;
Zlib.Unzip.prototype.getByte = Zlib.Zip.prototype.getByte;

/**
 * @fileoverview 雑多な関数群をまとめたモジュール実装.
 */


/**
 * Byte String から Byte Array に変換.
 * @param {!string} str byte string.
 * @return {!Array.<number>} byte array.
 */
Zlib.Util.stringToByteArray = function(str) {
  /** @type {!Array.<(string|number)>} */
  var tmp = str.split('');
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  for (i = 0, il = tmp.length; i < il; i++) {
    tmp[i] = (tmp[i].charCodeAt(0) & 0xff) >>> 0;
  }

  return tmp;
};


/**
 * @fileoverview Adler32 checksum 実装.
 */


/**
 * Adler32 ハッシュ値の作成
 * @param {!(Array|Uint8Array|string)} array 算出に使用する byte array.
 * @return {number} Adler32 ハッシュ値.
 */
Zlib.Adler32 = function(array) {
  if (typeof(array) === 'string') {
    array = Zlib.Util.stringToByteArray(array);
  }
  return Zlib.Adler32.update(1, array);
};

/**
 * Adler32 ハッシュ値の更新
 * @param {number} adler 現在のハッシュ値.
 * @param {!(Array|Uint8Array)} array 更新に使用する byte array.
 * @return {number} Adler32 ハッシュ値.
 */
Zlib.Adler32.update = function(adler, array) {
  /** @type {number} */
  var s1 = adler & 0xffff;
  /** @type {number} */
  var s2 = (adler >>> 16) & 0xffff;
  /** @type {number} array length */
  var len = array.length;
  /** @type {number} loop length (don't overflow) */
  var tlen;
  /** @type {number} array index */
  var i = 0;

  while (len > 0) {
    tlen = len > Zlib.Adler32.OptimizationParameter ?
        Zlib.Adler32.OptimizationParameter : len;
    len -= tlen;
    do {
      s1 += array[i++];
      s2 += s1;
    } while (--tlen);

    s1 %= 65521;
    s2 %= 65521;
  }

  return ((s2 << 16) | s1) >>> 0;
};

/**
 * Adler32 最適化パラメータ
 * 現状では 1024 程度が最適.
 * @see http://jsperf.com/adler-32-simple-vs-optimized/3
 * @define {number}
 */
Zlib.Adler32.OptimizationParameter = 1024;




/**
 * ビットストリーム
 * @constructor
 * @param {!(Array|Uint8Array)=} buffer output buffer.
 * @param {number=} bufferPosition start buffer pointer.
 */
Zlib.BitStream = function(buffer, bufferPosition) {
  /** @type {number} buffer index. */
  this.index = typeof bufferPosition === 'number' ? bufferPosition : 0;
  /** @type {number} bit index. */
  this.bitindex = 0;
  /** @type {!(Array|Uint8Array)} bit-stream output buffer. */
  this.buffer = buffer instanceof ( Uint8Array ) ?
      buffer :
      new ( Uint8Array )(Zlib.BitStream.DefaultBlockSize);

  // 入力された index が足りなかったら拡張するが、倍にしてもダメなら不正とする
  if (this.buffer.length * 2 <= this.index) {
    throw new Error("invalid index");
  } else if (this.buffer.length <= this.index) {
    this.expandBuffer();
  }
};

/**
 * デフォルトブロックサイズ.
 * @const
 * @type {number}
 */
Zlib.BitStream.DefaultBlockSize = 0x8000;

/**
 * expand buffer.
 * @return {!(Array|Uint8Array)} new buffer.
 */
Zlib.BitStream.prototype.expandBuffer = function() {
  /** @type {!(Array|Uint8Array)} old buffer. */
  var oldbuf = this.buffer;
  /** @type {number} loop limiter. */
  var il = oldbuf.length;
  /** @type {!(Array|Uint8Array)} new buffer. */
  var buffer =
      new ( Uint8Array )(il << 1);

  // copy buffer
  {
    buffer.set(oldbuf);
  }

  return (this.buffer = buffer);
};


/**
 * 数値をビットで指定した数だけ書き込む.
 * @param {number} number 書き込む数値.
 * @param {number} n 書き込むビット数.
 * @param {boolean=} reverse 逆順に書き込むならば true.
 */
Zlib.BitStream.prototype.writeBits = function(number, n, reverse) {
  var buffer = this.buffer;
  var index = this.index;
  var bitindex = this.bitindex;

  /** @type {number} current octet. */
  var current = buffer[index];
  /** @type {number} loop counter. */
  var i;

  /**
   * 32-bit 整数のビット順を逆にする
   * @param {number} n 32-bit integer.
   * @return {number} reversed 32-bit integer.
   * @private
   */
  function rev32_(n) {
    return (Zlib.BitStream.ReverseTable[n & 0xFF] << 24) |
        (Zlib.BitStream.ReverseTable[n >>> 8 & 0xFF] << 16) |
        (Zlib.BitStream.ReverseTable[n >>> 16 & 0xFF] << 8) |
        Zlib.BitStream.ReverseTable[n >>> 24 & 0xFF];
  }

  if (reverse && n > 1) {
    number = n > 8 ?
        rev32_(number) >> (32 - n) :
        Zlib.BitStream.ReverseTable[number] >> (8 - n);
  }

  // Byte 境界を超えないとき
  if (n + bitindex < 8) {
    current = (current << n) | number;
    bitindex += n;
    // Byte 境界を超えるとき
  } else {
    for (i = 0; i < n; ++i) {
      current = (current << 1) | ((number >> n - i - 1) & 1);

      // next byte
      if (++bitindex === 8) {
        bitindex = 0;
        buffer[index++] = Zlib.BitStream.ReverseTable[current];
        current = 0;

        // expand
        if (index === buffer.length) {
          buffer = this.expandBuffer();
        }
      }
    }
  }
  buffer[index] = current;

  this.buffer = buffer;
  this.bitindex = bitindex;
  this.index = index;
};


/**
 * ストリームの終端処理を行う
 * @return {!(Array|Uint8Array)} 終端処理後のバッファを byte array で返す.
 */
Zlib.BitStream.prototype.finish = function() {
  var buffer = this.buffer;
  var index = this.index;

  /** @type {!(Array|Uint8Array)} output buffer. */
  var output;

  // bitindex が 0 の時は余分に index が進んでいる状態
  if (this.bitindex > 0) {
    buffer[index] <<= 8 - this.bitindex;
    buffer[index] = Zlib.BitStream.ReverseTable[buffer[index]];
    index++;
  }

  // array truncation
  {
    output = buffer.subarray(0, index);
  }

  return output;
};

/**
 * 0-255 のビット順を反転したテーブル
 * @const
 * @type {!(Uint8Array|Array.<number>)}
 */
Zlib.BitStream.ReverseTable = (function(table) {
  return table;
})((function() {
  /** @type {!(Array|Uint8Array)} reverse table. */
  var table = new ( Uint8Array )(256);
  /** @type {number} loop counter. */
  var i;

  // generate
  for (i = 0; i < 256; ++i) {
    table[i] = (function(n) {
      var r = n;
      var s = 7;

      for (n >>>= 1; n; n >>>= 1) {
        r <<= 1;
        r |= n & 1;
        --s;
      }

      return (r << s & 0xff) >>> 0;
    })(i);
  }

  return table;
})());

/**
 * CRC32 ハッシュ値を取得
 * @param {!(Array.<number>|Uint8Array)} data data byte array.
 * @param {number=} pos data position.
 * @param {number=} length data length.
 * @return {number} CRC32.
 */
Zlib.CRC32.calc = function(data, pos, length) {
  return Zlib.CRC32.update(data, 0, pos, length);
};

/**
 * CRC32ハッシュ値を更新
 * @param {!(Array.<number>|Uint8Array)} data data byte array.
 * @param {number} crc CRC32.
 * @param {number=} pos data position.
 * @param {number=} length data length.
 * @return {number} CRC32.
 */
Zlib.CRC32.update = function(data, crc, pos, length) {
  var table = Zlib.CRC32.Table;
  var i = (typeof pos === 'number') ? pos : (pos = 0);
  var il = (typeof length === 'number') ? length : data.length;

  crc ^= 0xffffffff;

  // loop unrolling for performance
  for (i = il & 7; i--; ++pos) {
    crc = (crc >>> 8) ^ table[(crc ^ data[pos]) & 0xff];
  }
  for (i = il >> 3; i--; pos += 8) {
    crc = (crc >>> 8) ^ table[(crc ^ data[pos    ]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 1]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 2]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 3]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 4]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 5]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 6]) & 0xff];
    crc = (crc >>> 8) ^ table[(crc ^ data[pos + 7]) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
};

/**
 * @param {number} num
 * @param {number} crc
 * @returns {number}
 */
Zlib.CRC32.single = function(num, crc) {
  return (Zlib.CRC32.Table[(num ^ crc) & 0xff] ^ (num >>> 8)) >>> 0;
};

/**
 * @type {Array.<number>}
 * @const
 * @private
 */
Zlib.CRC32.Table_ = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
  0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
  0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
  0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
  0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
  0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
  0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
  0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
  0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
  0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
  0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
  0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
  0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
  0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
  0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
  0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
  0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
  0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
  0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
  0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
  0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
  0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
  0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
  0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
  0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
  0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
  0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
  0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
  0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
  0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
  0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
  0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
  0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
  0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
  0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];

/**
 * @type {!(Array.<number>|Uint32Array)} CRC-32 Table.
 * @const
 */
Zlib.CRC32.Table =   new Uint32Array(Zlib.CRC32.Table_) ;

/**
 * @fileoverview Deflate (RFC1951) 実装.
 * Deflateアルゴリズム本体は Zlib.RawDeflate で実装されている.
 */

/**
 * Zlib Deflate
 * @constructor
 * @param {!(Array|Uint8Array)} input 符号化する対象の byte array.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Deflate = function(input, opt_params) {
  /** @type {!(Array|Uint8Array)} */
  this.input = input;
  /** @type {!(Array|Uint8Array)} */
  this.output =
      new ( Uint8Array )(Zlib.Deflate.DefaultBufferSize);
  /** @type {Zlib.Deflate.CompressionType} */
  this.compressionType = Zlib.Deflate.CompressionType.DYNAMIC;
  /** @type {Zlib.RawDeflate} */
  this.rawDeflate;
  /** @type {Object} */
  var rawDeflateOption = {};
  /** @type {string} */
  var prop;

  // option parameters
  if (opt_params || !(opt_params = {})) {
    if (typeof opt_params['compressionType'] === 'number') {
      this.compressionType = opt_params['compressionType'];
    }
  }

  // copy options
  for (prop in opt_params) {
    rawDeflateOption[prop] = opt_params[prop];
  }

  // set raw-deflate output buffer
  rawDeflateOption['outputBuffer'] = this.output;

  this.rawDeflate = new Zlib.RawDeflate(this.input, rawDeflateOption);
};

/**
 * @const
 * @type {number} デフォルトバッファサイズ.
 */
Zlib.Deflate.DefaultBufferSize = 0x8000;

/**
 * @enum {number}
 */
Zlib.Deflate.CompressionType = Zlib.RawDeflate.CompressionType;

/**
 * 直接圧縮に掛ける.
 * @param {!(Array|Uint8Array)} input target buffer.
 * @param {Object=} opt_params option parameters.
 * @return {!(Array|Uint8Array)} compressed data byte array.
 */
Zlib.Deflate.compress = function(input, opt_params) {
  return (new Zlib.Deflate(input, opt_params)).compress();
};

/**
 * Deflate Compression.
 * @return {!(Array|Uint8Array)} compressed data byte array.
 */
Zlib.Deflate.prototype.compress = function() {
  /** @type {Zlib.CompressionMethod} */
  var cm;
  /** @type {number} */
  var cinfo;
  /** @type {number} */
  var cmf;
  /** @type {number} */
  var flg;
  /** @type {number} */
  var fcheck;
  /** @type {number} */
  var fdict;
  /** @type {number} */
  var flevel;
  /** @type {number} */
  var adler;
  /** @type {!(Array|Uint8Array)} */
  var output;
  /** @type {number} */
  var pos = 0;

  output = this.output;

  // Compression Method and Flags
  cm = Zlib.CompressionMethod.DEFLATE;
  switch (cm) {
    case Zlib.CompressionMethod.DEFLATE:
      cinfo = Math.LOG2E * Math.log(Zlib.RawDeflate.WindowSize) - 8;
      break;
    default:
      throw new Error('invalid compression method');
  }
  cmf = (cinfo << 4) | cm;
  output[pos++] = cmf;

  // Flags
  fdict = 0;
  switch (cm) {
    case Zlib.CompressionMethod.DEFLATE:
      switch (this.compressionType) {
        case Zlib.Deflate.CompressionType.NONE: flevel = 0; break;
        case Zlib.Deflate.CompressionType.FIXED: flevel = 1; break;
        case Zlib.Deflate.CompressionType.DYNAMIC: flevel = 2; break;
        default: throw new Error('unsupported compression type');
      }
      break;
    default:
      throw new Error('invalid compression method');
  }
  flg = (flevel << 6) | (fdict << 5);
  fcheck = 31 - (cmf * 256 + flg) % 31;
  flg |= fcheck;
  output[pos++] = flg;

  // Adler-32 checksum
  adler = Zlib.Adler32(this.input);

  this.rawDeflate.op = pos;
  output = this.rawDeflate.compress();
  pos = output.length;

  {
    // subarray 分を元にもどす
    output = new Uint8Array(output.buffer);
    // expand buffer
    if (output.length <= pos + 4) {
      this.output = new Uint8Array(output.length + 4);
      this.output.set(output);
      output = this.output;
    }
    output = output.subarray(0, pos + 4);
  }

  // adler32
  output[pos++] = (adler >> 24) & 0xff;
  output[pos++] = (adler >> 16) & 0xff;
  output[pos++] = (adler >>  8) & 0xff;
  output[pos++] = (adler      ) & 0xff;

  return output;
};

let _btoa;
if(typeof btoa === 'undefined') {
    _btoa = require('btoa');
} else {
    _btoa = btoa;
}

if (typeof process === 'object' && typeof window === 'undefined') {
    global.atob = function (str) {
        return Buffer.from(str, 'base64').toString('binary');
    };
}

/**
 * Make the target element movable by clicking and dragging on the handle.  This is not a general purprose function,
 * it makes several options specific to igv dialogs, the primary one being that the
 * target is absolutely positioned in pixel coordinates

 */

let dragData;   // Its assumed we are only dragging one element at a time.


function makeDraggable(target, handle) {
    handle.addEventListener('mousedown', dragStart.bind(target));
}


function dragStart(event) {

    event.stopPropagation();
    event.preventDefault();

    const pageCoords = offset(this);
    const dragFunction = drag.bind(this);
    const dragEndFunction = dragEnd.bind(this);
    const computedStyle = getComputedStyle(this);
    const top = parseInt(computedStyle.top.replace("px", ""));
    const left = parseInt(computedStyle.left.replace("px", ""));

    dragData =
        {
            dragFunction: dragFunction,
            dragEndFunction: dragEndFunction,
            screenX: event.screenX,
            screenY: event.screenY,
            top: top,
            left: left
        };

    document.addEventListener('mousemove', dragFunction);
    document.addEventListener('mouseup', dragEndFunction);
    document.addEventListener('mouseleave', dragEndFunction);
    document.addEventListener('mouseexit', dragEndFunction);
}

function drag(event) {

    if (!dragData) {
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    const dx = event.screenX - dragData.screenX;
    const dy = event.screenY - dragData.screenY;
    this.style.left = `${dragData.left + dx}px`;
    this.style.top = `${dragData.top + dy}px`;
}

function dragEnd(event) {

    if (!dragData) {
        return;
    }
    event.stopPropagation();
    event.preventDefault();

    const dragFunction = dragData.dragFunction;
    const dragEndFunction = dragData.dragEndFunction;
    document.removeEventListener('mousemove', dragFunction);
    document.removeEventListener('mouseup', dragEndFunction);
    document.removeEventListener('mouseleave', dragEndFunction);
    document.removeEventListener('mouseexit', dragEndFunction);
    dragData = undefined;
}

const appleCrayonPalette =
    {
        licorice: "#000000",
        lead: "#1e1e1e",
        tungsten: "#3a3a3a",
        iron: "#545453",
        steel: "#6e6e6e",
        tin: "#878687",
        nickel: "#888787",
        aluminum: "#a09fa0",
        magnesium: "#b8b8b8",
        silver: "#d0d0d0",
        mercury: "#e8e8e8",
        snow: "#ffffff",
        //
        cayenne: "#891100",
        mocha: "#894800",
        aspargus: "#888501",
        fern: "#458401",
        clover: "#028401",
        moss: "#018448",
        teal: "#008688",
        ocean: "#004a88",
        midnight: "#001888",
        eggplant: "#491a88",
        plum: "#891e88",
        maroon: "#891648",
        //
        maraschino: "#ff2101",
        tangerine: "#ff8802",
        lemon: "#fffa03",
        lime: "#83f902",
        spring: "#05f802",
        seam_foam: "#03f987",
        turquoise: "#00fdff",
        aqua: "#008cff",
        blueberry: "#002eff",
        grape: "#8931ff",
        magenta: "#ff39ff",
        strawberry: "#ff2987",
        //
        salmon: "#ff726e",
        cantaloupe: "#ffce6e",
        banana: "#fffb6d",
        honeydew: "#cefa6e",
        flora: "#68f96e",
        spindrift: "#68fbd0",
        ice: "#68fdff",
        sky: "#6acfff",
        orchid: "#6e76ff",
        lavender: "#d278ff",
        bubblegum: "#ff7aff",
        carnation: "#ff7fd3"
    };

const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


class AlertDialog {
    constructor(parent) {

        // container
        this.container = div({class: "igv-ui-alert-dialog-container"});
        parent.appendChild(this.container);
        this.container.setAttribute('tabIndex', '-1');

        // header
        const header = div();
        this.container.appendChild(header);

        const error = div();
        header.appendChild(error);
        error.textContent = "ERROR";

        // body container
        let bodyContainer = div({id: 'igv-ui-alert-dialog-body'});
        this.container.appendChild(bodyContainer);

        // body copy
        this.body = div({id: 'igv-ui-alert-dialog-body-copy'});
        bodyContainer.appendChild(this.body);

        // ok container
        let ok_container = div();
        this.container.appendChild(ok_container);

        // ok
        this.ok = div();
        ok_container.appendChild(this.ok);
        this.ok.textContent = 'OK';

        const okHandler = () => {

            if (typeof this.callback === 'function') {
                this.callback("OK");
                this.callback = undefined;
            }
            this.body.innerHTML = '';
            hide(this.container);
        };

        this.ok.addEventListener('click', event => {

            event.stopPropagation();

            okHandler();
        });

        this.container.addEventListener('keypress', event => {

            event.stopPropagation();

            if ('Enter' === event.key) {
                okHandler();
            }
        });

        makeDraggable(this.container, header);

        hide(this.container);
    }

    present(alert, callback) {
        let string = alert.message || alert;
        if (httpMessages.hasOwnProperty(string)) {
            string = httpMessages[string];
        }
        this.body.innerHTML = string;
        this.callback = callback;
        show(this.container);
        this.container.focus();
    }
}

// The global Alert dialog

let alertDialog;

const Alert = {
    init(root) {
        if (!alertDialog) {
            alertDialog = new AlertDialog(root);
        }
    },

    presentAlert: function (alert, callback) {
        alertDialog.present(alert, callback);
    },
};

class InputDialog {

    constructor(parent) {

        this.parent = parent;

        // dialog container
        this.container = div({class: 'igv-ui-generic-dialog-container'});
        parent.appendChild(this.container);

        // const { x, y, width, height } = this.container.getBoundingClientRect();
        // console.log(`InputDialog - x ${ x } y ${ y } width ${ width } height ${ height }`)

        // dialog header
        const header = div({class: 'igv-ui-generic-dialog-header'});
        this.container.appendChild(header);

        // dialog label
        this.label = div({class: 'igv-ui-generic-dialog-one-liner'});
        this.container.appendChild(this.label);
        this.label.text = 'Unlabeled';

        // input container
        this.input_container = div({class: 'igv-ui-generic-dialog-input'});
        this.container.appendChild(this.input_container);
        //
        this.input = document.createElement("input");
        this.input_container.appendChild(this.input);


        // ok | cancel
        const buttons = div({class: 'igv-ui-generic-dialog-ok-cancel'});
        this.container.appendChild(buttons);

        // ok
        this.ok = div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        hide(this.container);

        this.input.addEventListener('keyup', e => {
            if (13 === e.keyCode) {
                if (typeof this.callback === 'function') {
                    this.callback(this.input.value);
                    this.callback = undefined;
                }
                this.input.value = undefined;
                hide(this.container);
            }
        });

        this.ok.addEventListener('click', () => {
            if (typeof this.callback === 'function') {
                this.callback(this.input.value);
                this.callback = undefined;
            }
            this.input.value = undefined;
            hide(this.container);
        });

        const cancel = () => {
            this.input.value = '';
            hide(this.container);
        };

        this.cancel.addEventListener('click', cancel);

        attachDialogCloseHandlerWithParent(header, cancel);
        makeDraggable(this.container, header);

    }

    present(options, e) {

        this.label.textContent = options.label;
        this.input.value = options.value;
        this.callback = options.callback || options.click;

        show(this.container);
        const { x, y } = pageCoordinates(e);
        this.clampLocation(x, y);

    }

    clampLocation(pageX, pageY) {

        const { width:w, height:h } = this.container.getBoundingClientRect();

        const { x:px, y:py, width:pw, height:ph } = this.parent.getBoundingClientRect();

        const y = Math.min(Math.max(pageY, py), py + ph - h);
        const x = Math.min(Math.max(pageX, px), px + pw - w);
        this.container.style.left = `${ x }px`;
        this.container.style.top  = `${ y }px`;
    }
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class GenericContainer {

    constructor({parent,  top, left, width, height, border, closeHandler}) {

        let container = div({class: 'igv-ui-generic-container'});
        parent.appendChild(container);
        hide(container);
        this.container = container;

        if(top !== undefined) {
            this.container.style.width = top + "px";
        }
        if(left !== undefined) {
            this.container.style.width = left + "px";
        }
        if (width !== undefined) {
            this.container.style.width = width + "px";
        }
        if (height !== undefined) {
            this.container.style.height = height + "px";
        }
        if(border) {
            this.container.style.border = border;
        }
        //
        // let bbox = parent.getBoundingClientRect();
        // this.origin = {x: bbox.x, y: bbox.y};
        // this.container.offset({left: this.origin.x, top: this.origin.y});

        // header
        const header = div();
        this.container.appendChild(header);

        // close button
        attachDialogCloseHandlerWithParent(header, (e) => {
            hide(this.container);
            if(typeof closeHandler === "function") {
                closeHandler(e);
            }
        });

        makeDraggable(this.container, header);
    }

    show() {
        show(this.container);
    }

    hide() {
        hide(this.container);
    }

    dispose() {
        if(this.container.parent)  {
            this.container.parent.removeChild(this.container);
        }
    }
}

class ColorPicker extends GenericContainer {

    constructor({parent, top, left, width, height, defaultColors, colorHandler}) {

        super({ parent, top, left, width, height, border: '1px solid gray'});

        createColorSwatchSelector(this.container, colorHandler, defaultColors);
  }

}

const createColorSwatchSelector = (container, colorHandler, defaultColors) => {

    const hexColorStrings = Object.values(appleCrayonPalette);

    for (let hexColorString of hexColorStrings) {
        const swatch = div({ class: 'igv-ui-color-swatch' });
        container.appendChild(swatch);
        decorateSwatch(swatch, hexColorString, colorHandler);
    }

    if (defaultColors) {
        for (let hexColorString of defaultColors) {
            const swatch = div({ class: 'igv-ui-color-swatch' });
            container.appendChild(swatch);
            decorateSwatch(swatch, hexColorString, colorHandler);
        }
    }

};

const decorateSwatch = (swatch, hexColorString, colorHandler) => {

    swatch.style.backgroundColor = hexColorString;

    swatch.onmouseenter = () => swatch.style.borderColor = hexColorString;
    swatch.onmouseenter = () => swatch.style.borderColor = 'white';

    swatch.addEventListener('click', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

    swatch.addEventListener('touchend', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class Popover {

    constructor(parent) {

        this.parent = parent;

        // popover
        this.popover = div({ class: "igv-ui-popover" });
        parent.appendChild(this.popover);

        // header
        const popoverHeader = div();
        this.popover.appendChild(popoverHeader);

        attachDialogCloseHandlerWithParent(popoverHeader,  () => this.hide());
        makeDraggable(this.popover, popoverHeader);

        // content
        this.popoverContent = div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none';


    }

    presentContentWithEvent(e, content) {

        this.popover.style.display = 'block';

        this.popoverContent.innerHTML = content;

        present(e, this.popover);

    }

    presentMenu(e, menuItems) {

        if (0 === menuItems.length) {
            return
        }

        this.popover.style.display = 'block';

        const menuElements = createMenuElements(menuItems, this.popover);
        for (let item of menuElements) {
            this.popoverContent.appendChild(item.object);
        }

        present(e, this.popover);
    }

    hide() {
        this.popover.style.display = 'none';
        this.dispose();
    }

    dispose() {

        if (this.popover) {
            this.popover.parentNode.removeChild(this.popover);
        }

        const keys = Object.keys(this);
        for (let key of keys) {
            this[ key ] = undefined;
        }
    }

}

function present(e, popover) {

    const { x, y } = translateMouseCoordinates(e, popover.parentNode);

    // parent bbox
    const { width } = popover.parentNode.getBoundingClientRect();
    const { width: w } = popover.getBoundingClientRect();

    const xmax = x + w;

    popover.style.left = `${ xmax > width ? (x - (xmax - width)) : x }px`;
    popover.style.top  = `${ y }px`;

}

function createMenuElements(itemList, popover) {

    const list  = itemList.map(function (item, i) {
        let elem;

        if (typeof item === 'string') {
            elem = div();
            elem.innerHTML = item;
        } else if (typeof item === 'Node') {
            elem = item;
        } else {
            if (typeof item.init === 'function') {
                item.init();
            }

            if ("checkbox" === item.type) {
                elem = createCheckbox("Show all bases", item.value);
            } else if("color" === item.type) {
                const colorPicker = new ColorPicker({
                    parent: popover.parentElement,
                    width: 364,
                    //defaultColor: 'aqua',
                    colorHandler: (color) => item.click(color)
                });
                elem = div();
                if (typeof item.label === 'string') {
                    elem.innerHTML = item.label;
                }
                const clickHandler =  e => {
                    colorPicker.show();
                    hide(popover);
                    e.preventDefault();
                    e.stopPropagation();
                };
                elem.addEventListener('click', clickHandler);
                elem.addEventListener('touchend', clickHandler);
                elem.addEventListener('mouseup', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            else {
                elem = div();
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
                });

                // eslint-disable-next-line no-inner-declarations
                function handleClick(e) {
                    item.click();
                    hide(popover);
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }


        return { object: elem, init: item.init };
    });

    return list;
}

const style = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
};

class Checkbox {

    constructor({selected, label, onchange}) {

        this.state = selected;
        this.onchange = onchange;
        this.elem = div({style: style});

        const svgDiv = div({
            style: {
                width: '14px',
                height: '14px',
                borderColor: 'gray',
                borderWidth: '1px',
                borderStyle: 'solid'
            }
        });
        this.svg = createIcon('check', (true === selected ? '#444' : 'transparent'));
        this.svg.style.width = '12px';
        this.svg.style.height = '12px';
        svgDiv.appendChild(this.svg);
        this.elem.appendChild(svgDiv);

        if (label) {
            const d = div({style: {marginLeft: '5px'}}); //{ class: 'igv-some-label-class' });
            d.textContent = label;
            this.elem.appendChild(d);
        }

        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = !this.state;
            this.selected = newState;
            if (typeof this.onchange === 'function') {
                this.onchange(newState);
            }
        };
        this.elem.addEventListener('click', handleClick);
        this.elem.addEventListener('touchend', handleClick);
    }

    set selected(selected) {
        this.state = selected;
        const p = this.svg.querySelector('path');
        p.setAttributeNS(null, 'fill', (true === selected ? '#444' : 'transparent'));
    }

    get selected() {
        return this.state;
    }

    onchange(handler) {
        this.onchange = handler;
    }


}

/**
 * Generic container for UI components
 */
class Panel {

    constructor() {

        this.elem = create('div', {
            class: 'igv-ui-panel-column'
        });
    }

    add(component) {

        if(component instanceof Node) {
            this.elem.append(component);
        }
        else if(typeof component === 'object') {
            this.elem.append(component.elem);
        }
        else {
            // Assuming a string, possibly html
            const wrapper = div();
            wrapper.innerHTML = component;
            this.elem.append(wrapper);
        }
    }


}

class Textbox {

    constructor({text: value, label, onchange}) {

        this.elem = div({class: 'igv-ui-textbox'});

        if(label) {
            const div$1 = div();
            div$1.innerHTML = label;
            this.elem.appendChild(div$1);
        }

        this.textBox = create('input');
        if(value) {
            this.textBox.value = value;
        }
        this.elem.appendChild(this.textBox);

        if(onchange) {
            this.textBox.addEventListener('change', (e) => onchange(this.textBox.value));
        }
    }

    get value() {
        return this.textBox.value;
    }

    set value(v) {
        this.textBox.value = v;
    }
}

class Dialog {

    constructor({label, content, okHandler, cancelHandler}) {


        // dialog container
        this.elem = div({class: 'igv-ui-dialog'});

        // dialog header
        const header = div({class: 'igv-ui-dialog-header'});
        this.elem.appendChild(header);

        attachDialogCloseHandlerWithParent(header, cancel);

        // dialog label
        if(label) {
            const labelDiv = div({class: 'igv-ui-dialog-one-liner'});
            this.elem.appendChild(labelDiv);
            labelDiv.innerHTML = label;
        }

        // input container
        content.elem.style.margin = '8px';
        this.elem.appendChild(content.elem);

        // ok | cancel
        const buttons = div({class: 'igv-ui-dialog-ok-cancel'});
        this.elem.appendChild(buttons);

        // ok
        this.ok = div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        const self = this;
        this.ok.addEventListener('click', function () {
            hide(self.elem);
            if (typeof okHandler === 'function') {
                okHandler(self);
            }
        });

        this.cancel.addEventListener('click', cancel);

        makeDraggable(this.elem, header);

        function cancel() {
            self.canceled = true;
            hide(self.elem);
            if (typeof cancelHandler === 'function') {
                cancelHandler(self);
            }
        }


    }

    present(options, e) {

        this.label.textContent = options.label;
        this.input.value = options.value;
        this.callback = options.callback;

        const page = pageCoordinates(e);
        this.clampLocation(page.x, page.y);

        show(this.elem);
    }

    clampLocation(pageX, pageY) {

        let popoverRect = this.elem.getBoundingClientRect();
        let parentRect = this.parent.getBoundingClientRect();
        const y = Math.min(Math.max(pageY, parentRect.y), parentRect.y + parentRect.height - popoverRect.height);
        const x = Math.min(Math.max(pageX, parentRect.x), parentRect.x + parentRect.width - popoverRect.width);
        this.elem.style.left = x + "px";
        this.elem.style.top = y + "px";
    }
}

function embedCSS() {

    var css =  '.igv-ui-popover {\n  cursor: default;\n  position: absolute;\n  z-index: 2048;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: 1px;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: small;\n  background-color: white; }\n  .igv-ui-popover > div:first-child {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-popover > div:first-child > div {\n      margin-right: 4px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-popover > div:first-child > div:hover {\n      color: #444; }\n  .igv-ui-popover > div:last-child {\n    overflow-y: auto;\n    overflow-x: hidden;\n    max-height: 400px;\n    background-color: white; }\n    .igv-ui-popover > div:last-child > div {\n      -webkit-user-select: all;\n      /* Chrome/Safari */\n      -moz-user-select: all;\n      /* Firefox */\n      margin-left: 4px;\n      margin-right: 4px;\n      max-width: 384px;\n      min-width: 220px;\n      overflow-x: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n      .igv-ui-popover > div:last-child > div > span {\n        font-weight: bolder; }\n    .igv-ui-popover > div:last-child hr {\n      width: 100%; }\n\n.igv-ui-alert-dialog-container {\n  box-sizing: content-box;\n  position: absolute;\n  z-index: 2048;\n  top: 50%;\n  left: 50%;\n  width: 400px;\n  height: 200px;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  outline: none;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 15px;\n  font-weight: 400;\n  background-color: white;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  align-items: center; }\n  .igv-ui-alert-dialog-container > div:first-child {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-alert-dialog-container > div:first-child div:first-child {\n      padding-left: 8px; }\n  .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body {\n    color: #373737;\n    width: 100%;\n    height: calc(100% - 24px - 64px);\n    overflow-y: scroll; }\n    .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body #igv-ui-alert-dialog-body-copy {\n      cursor: pointer;\n      margin: 16px;\n      width: auto;\n      height: auto;\n      overflow-wrap: break-word;\n      word-break: break-word;\n      background-color: white;\n      border: unset; }\n  .igv-ui-alert-dialog-container > div:last-child {\n    width: 100%;\n    margin-bottom: 10px;\n    background-color: white;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: center;\n    align-items: center; }\n    .igv-ui-alert-dialog-container > div:last-child div {\n      margin: unset;\n      width: 40px;\n      height: 30px;\n      line-height: 30px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: small;\n      font-weight: 400;\n      border-color: #2B81AF;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-alert-dialog-container > div:last-child div:hover {\n      cursor: pointer;\n      border-color: #25597f;\n      background-color: #25597f; }\n\n.igv-ui-color-swatch {\n  box-sizing: content-box;\n  display: flex;\n  flex-flow: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  width: 32px;\n  height: 32px;\n  border-style: solid;\n  border-width: 2px;\n  border-color: white;\n  border-radius: 4px; }\n\n.igv-ui-colorpicker-menu-close-button {\n  display: flex;\n  flex-flow: row;\n  flex-wrap: nowrap;\n  justify-content: flex-end;\n  align-items: center;\n  width: 100%;\n  height: 32px;\n  margin-top: 4px;\n  margin-bottom: 4px;\n  padding-right: 8px; }\n  .igv-ui-colorpicker-menu-close-button i.fa {\n    display: block;\n    margin-left: 4px;\n    margin-right: 4px;\n    color: #5f5f5f; }\n  .igv-ui-colorpicker-menu-close-button i.fa:hover,\n  .igv-ui-colorpicker-menu-close-button i.fa:focus,\n  .igv-ui-colorpicker-menu-close-button i.fa:active {\n    cursor: pointer;\n    color: #0f0f0f; }\n\n.igv-ui-generic-dialog-container {\n  box-sizing: content-box;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 300px;\n  height: 200px;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  z-index: 2048;\n  background-color: white;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: center; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div {\n      margin-right: 4px;\n      margin-bottom: 2px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-one-liner {\n    color: #373737;\n    width: 95%;\n    height: 24px;\n    line-height: 24px;\n    text-align: left;\n    margin-top: 8px;\n    padding-left: 8px;\n    overflow-wrap: break-word;\n    background-color: white; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input {\n    margin-top: 8px;\n    width: 95%;\n    height: 24px;\n    color: #373737;\n    line-height: 24px;\n    padding-left: 8px;\n    background-color: white;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input div {\n      width: 30%;\n      height: 100%;\n      font-size: 16px;\n      text-align: right;\n      padding-right: 8px;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {\n      display: block;\n      height: 100%;\n      width: 100%;\n      padding-left: 4px;\n      font-family: \"Open Sans\", sans-serif;\n      font-weight: 400;\n      color: #373737;\n      text-align: left;\n      outline: none;\n      border-style: solid;\n      border-width: thin;\n      border-color: #7F7F7F;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {\n      width: 50%;\n      font-size: 16px; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input {\n    margin-top: 8px;\n    width: calc(100% - 16px);\n    height: 24px;\n    color: #373737;\n    line-height: 24px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {\n      display: block;\n      height: 100%;\n      width: 100%;\n      padding-left: 4px;\n      font-family: \"Open Sans\", sans-serif;\n      font-weight: 400;\n      color: #373737;\n      text-align: left;\n      outline: none;\n      border-style: solid;\n      border-width: thin;\n      border-color: #7F7F7F;\n      background-color: white; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {\n      font-size: 16px; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel {\n    width: 100%;\n    height: 28px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div {\n      margin-top: 32px;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      width: 75px;\n      height: 28px;\n      line-height: 28px;\n      text-align: center;\n      border-color: transparent;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 2px; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:first-child {\n      margin-left: 32px;\n      margin-right: 0;\n      background-color: #5ea4e0; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:last-child {\n      margin-left: 0;\n      margin-right: 32px;\n      background-color: #c4c4c4; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:first-child:hover {\n      cursor: pointer;\n      background-color: #3b5c7f; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel div:last-child:hover {\n      cursor: pointer;\n      background-color: #7f7f7f; }\n  .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok {\n    width: 100%;\n    height: 36px;\n    margin-top: 32px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok div {\n      width: 98px;\n      height: 36px;\n      line-height: 36px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: medium;\n      font-weight: 400;\n      border-color: white;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok div:hover {\n      cursor: pointer;\n      background-color: #25597f; }\n\n.igv-ui-generic-container {\n  box-sizing: content-box;\n  position: absolute;\n  z-index: 2048;\n  background-color: white;\n  cursor: pointer;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  align-items: center; }\n  .igv-ui-generic-container div:first-child {\n    cursor: move;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    height: 24px;\n    width: 100%;\n    background-color: #dddddd; }\n    .igv-ui-generic-container div:first-child div {\n      display: block;\n      color: #5f5f5f;\n      cursor: pointer;\n      width: 14px;\n      height: 14px;\n      margin-right: 8px;\n      margin-bottom: 4px; }\n\n.igv-ui-dialog {\n  z-index: 2048;\n  position: fixed;\n  width: fit-content;\n  height: fit-content;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  background-color: white;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400; }\n  .igv-ui-dialog .igv-ui-dialog-header {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-dialog .igv-ui-dialog-header div {\n      margin-right: 4px;\n      margin-bottom: 2px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-dialog .igv-ui-dialog-header div:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-dialog .igv-ui-dialog-one-liner {\n    width: 95%;\n    height: 24px;\n    line-height: 24px;\n    text-align: left;\n    margin: 8px;\n    overflow-wrap: break-word;\n    background-color: white;\n    font-weight: bold; }\n  .igv-ui-dialog .igv-ui-dialog-ok-cancel {\n    width: 100%;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div {\n      margin: 16px;\n      margin-top: 32px;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      width: 75px;\n      height: 28px;\n      line-height: 28px;\n      text-align: center;\n      border-color: transparent;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 2px; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child {\n      background-color: #5ea4e0; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child {\n      background-color: #c4c4c4; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child:hover {\n      cursor: pointer;\n      background-color: #3b5c7f; }\n    .igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child:hover {\n      cursor: pointer;\n      background-color: #7f7f7f; }\n  .igv-ui-dialog .igv-ui-dialog-ok {\n    width: 100%;\n    height: 36px;\n    margin-top: 32px;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: space-around;\n    align-items: center; }\n    .igv-ui-dialog .igv-ui-dialog-ok div {\n      width: 98px;\n      height: 36px;\n      line-height: 36px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: medium;\n      font-weight: 400;\n      border-color: white;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-dialog .igv-ui-dialog-ok div:hover {\n      cursor: pointer;\n      background-color: #25597f; }\n\n.igv-ui-panel, .igv-ui-panel-column, .igv-ui-panel-row {\n  z-index: 2048;\n  background-color: white;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start; }\n\n.igv-ui-panel-column {\n  display: flex;\n  flex-direction: column; }\n\n.igv-ui-panel-row {\n  display: flex;\n  flex-direction: row; }\n\n.igv-ui-textbox {\n  background-color: white;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: medium;\n  font-weight: 400;\n  display: flex;\n  justify-content: flex-start;\n  align-items: flex-start; }\n\n/*# sourceMappingURL=igv-ui.css.map */\n';

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;

    document.head.insertBefore(style, document.head.childNodes[ document.head.childNodes.length - 1 ]);

}

if(typeof document !== 'undefined') {
    if (!stylesheetExists("igv-ui.css")) {
        // console.log('igv-ui. will call embedCSS() ...');
        embedCSS();
        // console.log('... done.');
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
}

export { Alert, AlertDialog, Checkbox, ColorPicker, Dialog, GenericContainer, InputDialog, Panel, Popover, Textbox, createColorSwatchSelector };
