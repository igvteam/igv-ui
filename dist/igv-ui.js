function div(options) {
    return create$1("div", options);
}

function create$1(tag, options) {
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

function hideAll(selector) {
    document.querySelectorAll(selector).forEach(elem => { hide(elem); });
}

function empty(elem) {
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
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

const relativeDOMBBox = (parentElement, childElement) => {
    const { x: x_p, y: y_p, width: width_p, height: height_p } = parentElement.getBoundingClientRect();
    const { x: x_c, y: y_c, width: width_c, height: height_c } = childElement.getBoundingClientRect();
    return { x: (x_c - x_p), y: (y_c - y_p), width: width_c, height:height_c };
};

function applyStyle(elem, style) {
    for (let key of Object.keys(style)) {
        elem.style[key] = style[key];
    }
}

function guid  () {
    return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
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

var domUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    applyStyle: applyStyle,
    create: create$1,
    div: div,
    empty: empty,
    guid: guid,
    hide: hide,
    hideAll: hideAll,
    offset: offset,
    pageCoordinates: pageCoordinates,
    relativeDOMBBox: relativeDOMBBox,
    show: show,
    translateMouseCoordinates: translateMouseCoordinates
});

/*! @license DOMPurify 3.0.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.0.6/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports

let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;

if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}

if (!seal) {
  seal = function seal(x) {
    return x;
  };
}

if (!apply) {
  apply = function apply(fun, thisValue, args) {
    return fun.apply(thisValue, args);
  };
}

if (!construct) {
  construct = function construct(Func, args) {
    return new Func(...args);
  };
}

const arrayForEach = unapply(Array.prototype.forEach);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param {Function} func - The function to be wrapped and called.
 * @returns {Function} A new function that calls the given function with a specified thisArg and arguments.
 */

function unapply(func) {
  return function (thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param {Function} func - The constructor function to be wrapped and called.
 * @returns {Function} A new function that constructs an instance of the given constructor function with the provided arguments.
 */


function unconstruct(func) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return construct(func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param {Object} set - The set to which elements will be added.
 * @param {Array} array - The array containing elements to be added to the set.
 * @param {Function} transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns {Object} The modified set with added elements.
 */


function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;

  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }

  let l = array.length;

  while (l--) {
    let element = array[l];

    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);

      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }

        element = lcElement;
      }
    }

    set[element] = true;
  }

  return set;
}
/**
 * Shallow clone an object
 *
 * @param {Object} object - The object to be cloned.
 * @returns {Object} A new object that copies the original.
 */


function clone(object) {
  const newObject = create(null);

  for (const [property, value] of entries(object)) {
    if (getOwnPropertyDescriptor(object, property) !== undefined) {
      newObject[property] = value;
    }
  }

  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param {Object} object - The object to look up the getter function in its prototype chain.
 * @param {String} prop - The property name for which to find the getter function.
 * @returns {Function} The getter function found in the prototype chain or a fallback function.
 */

function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);

    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }

      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }

    object = getPrototypeOf(object);
  }

  function fallbackValue(element) {
    console.warn('fallback value for', element);
    return null;
  }

  return fallbackValue;
}

const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']); // SVG

const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']); // List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.

const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']); // Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.

const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const text = freeze(['#text']);

const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode

const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape

const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape

const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);

var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  ERB_EXPR: ERB_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR,
  DATA_ATTR: DATA_ATTR,
  ARIA_ATTR: ARIA_ATTR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  DOCTYPE_NAME: DOCTYPE_NAME
});

const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
 * @param {HTMLScriptElement} purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */


const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  } // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.


  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';

  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }

  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');

  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },

      createScriptURL(scriptUrl) {
        return scriptUrl;
      }

    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};

function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

  const DOMPurify = root => createDOMPurify(root);
  /**
   * Version label, exposed for easier checks
   * if DOMPurify is up to date or not
   */


  DOMPurify.version = '3.0.6';
  /**
   * Array of elements that DOMPurify removed during sanitation.
   * Empty if nothing was removed.
   */

  DOMPurify.removed = [];

  if (!window || !window.document || window.document.nodeType !== 9) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }

  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode'); // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.

  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');

    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }

  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = {};
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */

  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */

  /* allowed element names */

  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */

  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */

  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */

  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */

  let FORBID_ATTR = null;
  /* Decide if ARIA attributes are okay */

  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */

  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */

  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */

  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */

  let SAFE_FOR_TEMPLATES = false;
  /* Decide if document with <html>... should be returned */

  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */

  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */

  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */

  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */

  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */

  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */

  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */

  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */

  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */

  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */

  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */

  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */

  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */

  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */

  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */

  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  /* Parsing of strict XHTML documents */

  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */

  let CONFIG = null;
  /* Ideally, do not touch anything below this line */

  /* ______________________________________________ */

  const formElement = document.createElement('form');

  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param  {Object} cfg optional config literal
   */
  // eslint-disable-next-line complexity


  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */


    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */


    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE; // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.

    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */

    ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = 'ALLOWED_NAMESPACES' in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), // eslint-disable-line indent
    cfg.ADD_URI_SAFE_ATTR, // eslint-disable-line indent
    transformCaseFunc // eslint-disable-line indent
    ) // eslint-disable-line indent
    : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), // eslint-disable-line indent
    cfg.ADD_DATA_URI_TAGS, // eslint-disable-line indent
    transformCaseFunc // eslint-disable-line indent
    ) // eslint-disable-line indent
    : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
    FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
    USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true

    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true

    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false

    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true

    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false

    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false

    RETURN_DOM = cfg.RETURN_DOM || false; // Default false

    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false

    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false

    FORCE_BODY = cfg.FORCE_BODY || false; // Default false

    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true

    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false

    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true

    IN_PLACE = cfg.IN_PLACE || false; // Default false

    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};

    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }

    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }

    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }

    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }

    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */


    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, [...text]);
      ALLOWED_ATTR = [];

      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }

      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }

      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }

      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */


    if (cfg.ADD_TAGS) {
      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }

      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
    }

    if (cfg.ADD_ATTR) {
      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }

      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
    }

    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }

    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }

      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */


    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */


    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */


    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }

    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }

      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      } // Overwrite existing TrustedTypes policy.


      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY; // Sign local variables required by `sanitize`.

      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      } // If creating the internal policy succeeded sign internal variables.


      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    } // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.


    if (freeze) {
      freeze(cfg);
    }

    CONFIG = cfg;
  };

  const MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  const HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']); // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.

  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */

  const ALL_SVG_TAGS = addToSet({}, svg$1);
  addToSet(ALL_SVG_TAGS, svgFilters);
  addToSet(ALL_SVG_TAGS, svgDisallowed);
  const ALL_MATHML_TAGS = addToSet({}, mathMl$1);
  addToSet(ALL_MATHML_TAGS, mathMlDisallowed);
  /**
   * @param  {Element} element a DOM element whose namespace is being checked
   * @returns {boolean} Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */

  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element); // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.

    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }

    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);

    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }

    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      } // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.


      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      } // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.


      return Boolean(ALL_SVG_TAGS[tagName]);
    }

    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      } // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points


      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      } // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.


      return Boolean(ALL_MATHML_TAGS[tagName]);
    }

    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }

      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      } // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace


      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    } // For XHTML and XML documents that support custom namespaces


    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    } // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.


    return false;
  };
  /**
   * _forceRemove
   *
   * @param  {Node} node a DOM node
   */


  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });

    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      node.parentNode.removeChild(node);
    } catch (_) {
      node.remove();
    }
  };
  /**
   * _removeAttribute
   *
   * @param  {String} name an Attribute name
   * @param  {Node} node a DOM node
   */


  const _removeAttribute = function _removeAttribute(name, node) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: node.getAttributeNode(name),
        from: node
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: node
      });
    }

    node.removeAttribute(name); // We void attribute values for unremovable "is"" attributes

    if (name === 'is' && !ALLOWED_ATTR[name]) {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(node);
        } catch (_) {}
      } else {
        try {
          node.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param  {String} dirty a string of dirty markup
   * @return {Document} a DOM, filled with the dirty markup
   */


  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;

    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }

    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }

    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */

    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */


    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);

      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {// Syntax error if dirtyPayload is invalid xml
      }
    }

    const body = doc.body || doc.documentElement;

    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */


    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }

    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param  {Node} root The root element or node to start traversing on.
   * @return {NodeIterator} The created NodeIterator
   */


  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null);
  };
  /**
   * _isClobbered
   *
   * @param  {Node} elm element to check for clobbering attacks
   * @return {Boolean} true if clobbered, false if safe
   */


  const _isClobbered = function _isClobbered(elm) {
    return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function' || typeof elm.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param  {Node} object object to check whether it's a DOM node
   * @return {Boolean} true is object is a DOM node
   */


  const _isNode = function _isNode(object) {
    return typeof Node === 'function' && object instanceof Node;
  };
  /**
   * _executeHook
   * Execute user configurable hooks
   *
   * @param  {String} entryPoint  Name of the hook's entry point
   * @param  {Node} currentNode node to work on with the hook
   * @param  {Object} data additional hook parameters
   */


  const _executeHook = function _executeHook(entryPoint, currentNode, data) {
    if (!hooks[entryPoint]) {
      return;
    }

    arrayForEach(hooks[entryPoint], hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  };
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   *
   * @param   {Node} currentNode to check for permission to exist
   * @return  {Boolean} true if node was killed, false if left alive
   */


  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */

    _executeHook('beforeSanitizeElements', currentNode, null);
    /* Check if element is clobbered or can clobber */


    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Now let's check the element's type and name */


    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */

    _executeHook('uponSanitizeElement', currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */


    if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Remove element if anything forbids its presence */


    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }

        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */


      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;

        if (childNodes && parentNode) {
          const childCount = childNodes.length;

          for (let i = childCount - 1; i >= 0; --i) {
            parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
          }
        }
      }

      _forceRemove(currentNode);

      return true;
    }
    /* Check whether element has a valid namespace */


    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */


    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);

      return true;
    }
    /* Sanitize element content to be template-safe */


    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });

      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeElements', currentNode, null);

    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param  {string} lcTag Lowercase tag name of containing element.
   * @param  {string} lcName Lowercase attribute name.
   * @param  {string} value Attribute value.
   * @return {Boolean} Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity


  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */


    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if ( // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */

    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
      return false;
    } else ;

    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param {string} tagName name of the tag of the node to sanitize
   * @returns {boolean} Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */


  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName.indexOf('-') > 0;
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param  {Node} currentNode to sanitize
   */


  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHook('beforeSanitizeAttributes', currentNode, null);

    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */

    if (!attributes) {
      return;
    }

    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */

    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      let value = name === 'value' ? attrValue : stringTrim(attrValue);
      /* Execute a hook if present */

      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set

      _executeHook('uponSanitizeAttribute', currentNode, hookEvent);

      value = hookEvent.attrValue;
      /* Did the hooks approve of the attribute? */

      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Remove attribute */


      _removeAttribute(name, currentNode);
      /* Did the hooks approve of the attribute? */


      if (!hookEvent.keepAttr) {
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */


      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);

        continue;
      }
      /* Sanitize attribute content to be template-safe */


      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */


      const lcTag = transformCaseFunc(currentNode.nodeName);

      if (!_isValidAttribute(lcTag, lcName, value)) {
        continue;
      }
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */


      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode); // Prefix the value and later re-create the attribute with the sanitized value


        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Handle attributes that require Trusted Types */


      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ; else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }

            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */


      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
          currentNode.setAttribute(name, value);
        }

        arrayPop(DOMPurify.removed);
      } catch (_) {}
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeAttributes', currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param  {DocumentFragment} fragment to iterate over recursively
   */


  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;

    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */


    _executeHook('beforeSanitizeShadowDOM', fragment, null);

    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHook('uponSanitizeShadowNode', shadowNode, null);
      /* Sanitize tags and elements */


      if (_sanitizeElements(shadowNode)) {
        continue;
      }
      /* Deep shadow DOM detected */


      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
      /* Check attributes, sanitize if necessary */


      _sanitizeAttributes(shadowNode);
    }
    /* Execute a hook if present */


    _executeHook('afterSanitizeShadowDOM', fragment, null);
  };
  /**
   * Sanitize
   * Public method providing core sanitation functionality
   *
   * @param {String|Node} dirty string or DOM node
   * @param {Object} cfg object
   */
  // eslint-disable-next-line complexity


  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */

    IS_EMPTY_INPUT = !dirty;

    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */


    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();

        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */


    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */


    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */


    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */

    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }

    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);

        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);

      if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */


      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */

      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */


    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */


    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */


    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      if (_sanitizeElements(currentNode)) {
        continue;
      }
      /* Shadow DOM detected, sanitize it */


      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
      /* Check attributes, sanitize if necessary */


      _sanitizeAttributes(currentNode);
    }
    /* If we sanitized `dirty` in-place, return it. */


    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */


    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);

        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }

      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }

      return returnNode;
    }

    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */

    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */


    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }

    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  /**
   * Public method to set the configuration once
   * setConfig
   *
   * @param {Object} cfg configuration object
   */


  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _parseConfig(cfg);

    SET_CONFIG = true;
  };
  /**
   * Public method to remove the configuration
   * clearConfig
   *
   */


  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  /**
   * Public method to check if an attribute value is valid.
   * Uses last set config, if any. Otherwise, uses config defaults.
   * isValidAttribute
   *
   * @param  {String} tag Tag name of containing element.
   * @param  {String} attr Attribute name.
   * @param  {String} value Attribute value.
   * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
   */


  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }

    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  /**
   * AddHook
   * Public method to add DOMPurify hooks
   *
   * @param {String} entryPoint entry point for the hook to add
   * @param {Function} hookFunction function to execute
   */


  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }

    hooks[entryPoint] = hooks[entryPoint] || [];
    arrayPush(hooks[entryPoint], hookFunction);
  };
  /**
   * RemoveHook
   * Public method to remove a DOMPurify hook at a given entryPoint
   * (pops it from the stack of hooks if more are present)
   *
   * @param {String} entryPoint entry point for the hook to remove
   * @return {Function} removed(popped) hook
   */


  DOMPurify.removeHook = function (entryPoint) {
    if (hooks[entryPoint]) {
      return arrayPop(hooks[entryPoint]);
    }
  };
  /**
   * RemoveHooks
   * Public method to remove all DOMPurify hooks at a given entryPoint
   *
   * @param  {String} entryPoint entry point for the hooks to remove
   */


  DOMPurify.removeHooks = function (entryPoint) {
    if (hooks[entryPoint]) {
      hooks[entryPoint] = [];
    }
  };
  /**
   * RemoveAllHooks
   * Public method to remove all DOMPurify hooks
   */


  DOMPurify.removeAllHooks = function () {
    hooks = {};
  };

  return DOMPurify;
}

var purify = createDOMPurify();

class Textbox {

    constructor({value, label, onchange}) {

        this.elem = div({class: 'igv-ui-generic-dialog-label-input'});

        if(label) {
            const div$1 = div();
            div$1.innerHTML = label;
            this.elem.appendChild(div$1);
        }

        this.textBox = create$1('input');
        if(value) {
            this.textBox.value = purify.sanitize(value);
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

/**
 * Generic container for UI components
 */
class Panel {

    constructor() {

        this.elem = create$1('div', {
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

var icons$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createCheckbox: createCheckbox,
    createIcon: createIcon
});

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

var uiUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    attachDialogCloseHandlerWithParent: attachDialogCloseHandlerWithParent
});

/**
 * Make the target element movable by clicking and dragging on the handle.  This is not a general purprose function,
 * it makes several options specific to igv dialogs, the primary one being that the
 * target is absolutely positioned in pixel coordinates

 */

let dragData;  // Its assumed we are only dragging one element at a time.

function makeDraggable(target, handle, constraint) {

    handle.addEventListener('mousedown', dragStart.bind(target));

    function dragStart(event) {

        event.stopPropagation();
        event.preventDefault();

        const dragFunction = drag.bind(this);
        const dragEndFunction = dragEnd.bind(this);
        const computedStyle = getComputedStyle(this);

        dragData =
            {
                constraint,
                dragFunction,
                dragEndFunction,
                screenX: event.screenX,
                screenY: event.screenY,
                top: parseInt(computedStyle.top.replace("px", "")),
                left: parseInt(computedStyle.left.replace("px", ""))
            };

        document.addEventListener('mousemove', dragFunction);
        document.addEventListener('mouseup', dragEndFunction);
        document.addEventListener('mouseleave', dragEndFunction);
        document.addEventListener('mouseexit', dragEndFunction);
    }
}

function drag(event) {

    if (!dragData) {
        console.error("No drag data!");
        return;
    }
    event.stopPropagation();
    event.preventDefault();
    const dx = event.screenX - dragData.screenX;
    const dy = event.screenY - dragData.screenY;

    const left = dragData.left + dx;
    const  top = dragData.constraint ? Math.max(dragData.constraint.minY, dragData.top  + dy) : dragData.top  + dy;

    this.style.left = `${ left }px`;
    this.style.top  = `${  top }px`;
}

function dragEnd(event) {

    if (!dragData) {
        console.error("No drag data!");
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

class Dialog {

    constructor({label, content, okHandler, cancelHandler}) {

        const cancel = () => {
            hide(this.elem);
            if (typeof cancelHandler === 'function') {
                cancelHandler(this);
            }
        };

        // dialog container
        this.elem = div({class: 'igv-ui-generic-dialog-container'});

        // dialog header
        const header = div({class: 'igv-ui-generic-dialog-header'});
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
        const buttons = div({class: 'igv-ui-generic-dialog-ok-cancel'});
        this.elem.appendChild(buttons);

        // ok
        this.ok = div();
        buttons.appendChild(this.ok);
        this.ok.textContent = 'OK';

        // cancel
        this.cancel = div();
        buttons.appendChild(this.cancel);
        this.cancel.textContent = 'Cancel';

        this.ok.addEventListener('click',  (e) => {
            hide(this.elem);
            if (typeof okHandler === 'function') {
                okHandler(this);
            }
        });

        this.cancel.addEventListener('click', cancel);

        makeDraggable(this.elem, header);


        // Consume all clicks in component
        this.elem.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

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

class DataRangeDialog {

    constructor(parent, okHandler) {

        const panel = new Panel();
        this.minbox = new Textbox({label: "Minimum", value: "0"});
        panel.add(this.minbox);

        this.maxbox = new Textbox({label: "Maximum", value: "0"});
        panel.add(this.maxbox);

        let callback;
        if (okHandler) {
            callback = (e) => {
                okHandler(Number.parseFloat(this.minbox.value), Number.parseFloat(this.maxbox.value));
            };
        } else {
            callback = (d) => {
                console.log(`Minimum: ${this.minbox.value}`);
                console.log(`Maximum: ${this.maxbox.value}`);
            };
        }

        this.dialog = new Dialog({
            //label: 'Multi-select',
            content: panel,
            okHandler: callback
        });

        // Overide some css styles -- TODO redesign this.
        this.dialog.elem.style.position = "absolute";

        hide(this.dialog.elem);
        parent.appendChild(this.dialog.elem);
    }

    show({min, max}) {
        if (min !== undefined) this.minbox.value = min.toString();
        if (max !== undefined) this.maxbox.value = max.toString();
        show(this.dialog.elem);
    }
}

const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


class AlertDialog {
    /**
     * Initialize a new alert dialog
     * @param parent
     * @param alertProps - Optional - properties such as scroll to error
     */
    constructor(parent, alertProps) {
        this.alertProps = Object.assign({
            /** When an alert is presented - focus occur */
            shouldFocus: true,
            /** When focus occur - scroll into that element in the view */
            preventScroll: false
        }, alertProps);

        // container
        this.container = div({class: "igv-ui-alert-dialog-container"});
        parent.appendChild(this.container);
        this.container.setAttribute('tabIndex', '-1');

        // header
        const header = div();
        this.container.appendChild(header);

        this.errorHeadline = div();
        header.appendChild(this.errorHeadline);
        this.errorHeadline.textContent = '';

        // body container
        let bodyContainer = div({class: 'igv-ui-alert-dialog-body'});
        this.container.appendChild(bodyContainer);

        // body copy
        this.body = div({class: 'igv-ui-alert-dialog-body-copy'});
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

        this.errorHeadline.textContent = alert.message ? 'ERROR' : '';
        let string = alert.message || alert;

        if (httpMessages.hasOwnProperty(string)) {
            string = httpMessages[string];
        }

        const clean = purify.sanitize(string);

        this.body.innerHTML = clean;
        this.callback = callback;
        show(this.container);
        if (this.alertProps.shouldFocus) {
            this.container.focus(
                { preventScroll: this.alertProps.preventScroll }
            );
        }
    }
}

class AlertSingleton {
    constructor(root) {

        if (root) {
            this.alertDialog = undefined;
        }
    }

    init(root) {
        this.alertDialog = new AlertDialog(root);
    }

    present(alert, callback) {
        this.alertDialog.present(alert, callback);
    }

}

var alertSingleton = new AlertSingleton();

// The global Alert dialog

let alertDialog;

const Alert = {

    init(root, config={}) {
	    alertDialog = new AlertDialog(root, config);
    },

    presentAlert (alert, callback) {
        if(!alertDialog) {
            this.init(document.body);
        }
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

        // input element.  DO NOT ACCESS THIS OUTSIDE OF THIS CLASS
        this._input = document.createElement("input");
        this.input_container.appendChild(this._input);


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

        this._input.addEventListener('keyup', e => {
            if (13 === e.keyCode) {
                if (typeof this.callback === 'function') {
                    this.callback(this._input.value);
                    this.callback = undefined;
                }
                this._input.value = undefined;
                hide(this.container);
            }
        });

        this.ok.addEventListener('click', () => {
            if (typeof this.callback === 'function') {
                this.callback(this._input.value);
                this.callback = undefined;
            }
            this._input.value = undefined;
            hide(this.container);
        });

        const cancel = () => {
            this._input.value = '';
            hide(this.container);
        };

        this.cancel.addEventListener('click', cancel);

        attachDialogCloseHandlerWithParent(header, cancel);
        makeDraggable(this.container, header);

    }

    get value() {
        return purify.sanitize(this._input.value)
    }

    present(options, e) {

        this.label.textContent = options.label;
        this._input.value = options.value;
        this.callback = options.callback || options.click;

        show(this.container);
        this.clampLocation(e.clientX, e.clientY);

    }

    clampLocation(clientX, clientY) {

        const {width: w, height: h} = this.container.getBoundingClientRect();
        const wh = window.innerHeight;
        const ww = window.innerWidth;

        const y = Math.min(wh - h, clientY);
        const x = Math.min(ww - w, clientX);
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;

    }
}

class SliderDialog {

    constructor(parent) {

        this.parent = parent;

        // dialog container
        this.container = div({class: 'igv-ui-generic-dialog-container'});
        parent.appendChild(this.container);

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

        // input element
        let html = `<input type="range" id="igv-slider-dialog-input" name="igv-slider-dialog-input" />`;
        this._input = document.createRange().createContextualFragment(html).firstChild;
        this.input_container.appendChild(this._input);

        // output element
        html = `<output id="igv-slider-dialog-output" name="igv-slider-dialog-output" for="igv-slider-dialog-input"></output>`;
        this._output = document.createRange().createContextualFragment(html).firstChild;
        this.input_container.appendChild(this._output);


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

        this._input.addEventListener('input', () => {
            const number = parseFloat(this._input.value)/this._scaleFactor;
            this.callback(number);
            this._output.value = `${number.toFixed(2)}`;
        }, false);

        this.ok.addEventListener('click', () => {
            if (typeof this.callback === 'function') {
                const number = parseFloat(this._input.value)/this._scaleFactor;
                this.callback(number);
                this.callback = undefined;
            }
            this._input.value = undefined;
            hide(this.container);
        });

        const cancel = () => {
            this._input.value = undefined;
            hide(this.container);
        };

        this.cancel.addEventListener('click', cancel);

        attachDialogCloseHandlerWithParent(header, cancel);
        makeDraggable(this.container, header);

    }

    get value() {
        return purify.sanitize(this._input.value)
    }

    present(options, e) {

        this.label.textContent = options.label;

        this._scaleFactor = options.scaleFactor;
        const [ minS, maxS, valueS ] = [ options.min, options.max, options.value ].map(number => (Math.floor(this._scaleFactor * number)).toString());

        this._input.min = minS;
        this._input.max = maxS;
        this._input.value = valueS;

        const numer = parseFloat(valueS);
        const denom = this._scaleFactor;
        const number = numer/denom;
        this._output.value = `${number.toFixed(2)}`;

        this.callback = options.callback || options.click;

        show(this.container);
        this.clampLocation(e.clientX, e.clientY);

    }

    clampLocation(clientX, clientY) {

        const {width: w, height: h} = this.container.getBoundingClientRect();
        const wh = window.innerHeight;
        const ww = window.innerWidth;

        const y = Math.min(wh - h, clientY);
        const x = Math.min(ww - w, clientX);
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;

    }
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

const nucleotideColorComponents = {
    "A": [0, 200, 0],
    "C": [0, 0, 200],
    "T": [255, 0, 0],
    "G": [209, 113, 5],
    "a": [0, 200, 0],
    "c": [0, 0, 200],
    "t": [255, 0, 0],
    "g": [209, 113, 5],
    "N": [80, 80, 80]
};

const nucleotideColors = {
    "A": "rgb(  0, 200,   0)",
    "C": "rgb(  0,   0, 200)",
    "T": "rgb(255,   0,   0)",
    "G": "rgb(209, 113,   5)",
    "a": "rgb(  0, 200,   0)",
    "c": "rgb(  0,   0, 200)",
    "t": "rgb(255,   0,   0)",
    "g": "rgb(209, 113,   5)",
    "N": "rgb(80, 80, 80)"
};

const colorPalettes = {

    Set1:
        [
            "rgb(228,26,28)",
            "rgb(55,126,184)",
            "rgb(77,175,74)",
            "rgb(166,86,40)",
            "rgb(152,78,163)",
            "rgb(255,127,0)",
            "rgb(247,129,191)",
            "rgb(153,153,153)",
            "rgb(255,255,51)"
        ],

    Dark2:
        [
            "rgb(27,158,119)",
            "rgb(217,95,2)",
            "rgb(117,112,179)",
            "rgb(231,41,138)",
            "rgb(102,166,30)",
            "rgb(230,171,2)",
            "rgb(166,118,29)",
            "rgb(102,102,102)"
        ],

    Set2:
        [
            "rgb(102, 194,165)",
            "rgb(252,141,98)",
            "rgb(141,160,203)",
            "rgb(231,138,195)",
            "rgb(166,216,84)",
            "rgb(255,217,47)",
            "rgb(229,196,148)",
            "rgb(179,179,179)"
        ],

    Set3:
        [
            "rgb(141,211,199)",
            "rgb(255,255,179)",
            "rgb(190,186,218)",
            "rgb(251,128,114)",
            "rgb(128,177,211)",
            "rgb(253,180,98)",
            "rgb(179,222,105)",
            "rgb(252,205,229)",
            "rgb(217,217,217)",
            "rgb(188,128,189)",
            "rgb(204,235,197)",
            "rgb(255,237,111)"
        ],

    Pastel1:
        [
            "rgb(251,180,174)",
            "rgb(179,205,227)",
            "rgb(204,235,197)",
            "rgb(222,203,228)",
            "rgb(254,217,166)",
            "rgb(255,255,204)",
            "rgb(229,216,189)",
            "rgb(253,218,236)"
        ],

    Pastel2:
        [
            "rgb(173,226,207)",
            "rgb(253,205,172)",
            "rgb(203,213,232)",
            "rgb(244,202,228)",
            "rgb(230,245,201)",
            "rgb(255,242,174)",
            "rgb(243,225,206)"
        ],

    Accent:
        [
            "rgb(127,201,127)",
            "rgb(190,174,212)",
            "rgb(253,192,134)",
            "rgb(255,255,153)",
            "rgb(56,108,176)",
            "rgb(240,2,127)",
            "rgb(191,91,23)"
        ]
};

function PaletteColorTable  (palette) {

    this.colors = colorPalettes[palette];

    if (!Array.isArray(this.colors)) this.colors = [];
    this.colorTable = {};
    this.nextIdx = 0;
    this.colorGenerator = new RandomColorGenerator();

}

PaletteColorTable.prototype.getColor = function (key) {

    if (!this.colorTable.hasOwnProperty(key)) {
        if (this.nextIdx < this.colors.length) {
            this.colorTable[key] = this.colors[this.nextIdx];
        } else {
            this.colorTable[key] = this.colorGenerator.get();
        }
        this.nextIdx++;
    }
    return this.colorTable[key];
};

// Random color generator from https://github.com/sterlingwes/RandomColor/blob/master/rcolor.js
// Free to use & distribute under the MIT license
// Wes Johnson (@SterlingWes)
//
// inspired by http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
function RandomColorGenerator() {
    this.hue = Math.random();
    this.goldenRatio = 0.618033988749895;
    this.hexwidth = 2;
}

RandomColorGenerator.prototype.hsvToRgb = function (h, s, v) {
    var h_i = Math.floor(h * 6),
        f = h * 6 - h_i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        r = 255,
        g = 255,
        b = 255;
    switch (h_i) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)];
};

RandomColorGenerator.prototype.padHex = function (str) {
    if (str.length > this.hexwidth) return str;
    return new Array(this.hexwidth - str.length + 1).join('0') + str;
};

RandomColorGenerator.prototype.get = function (saturation, value) {
    this.hue += this.goldenRatio;
    this.hue %= 1;
    if (typeof saturation !== "number") saturation = 0.5;
    if (typeof value !== "number") value = 0.95;
    var rgb = this.hsvToRgb(this.hue, saturation, value);

    return "#" + this.padHex(rgb[0].toString(16))
        + this.padHex(rgb[1].toString(16))
        + this.padHex(rgb[2].toString(16));

};

class GenericContainer {

    constructor({parent,  top, left, width, height, border, closeHandler}) {

        let container = div({class: 'igv-ui-generic-container'});
        parent.appendChild(container);
        hide(container);
        this.container = container;

        if(top !== undefined) {
            this.container.style.top = `${ top }px`;
        }
        if(left !== undefined) {
            this.container.style.left = `${ left }px`;
        }
        if (width !== undefined) {
            this.container.style.width = `${ width }px`;
        }
        if (height !== undefined) {
            this.container.style.height = `${ height }px`;
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

    swatch.addEventListener('mouseenter', e => swatch.style.borderColor = hexColorString);

    swatch.addEventListener('mouseleave', e => swatch.style.borderColor = 'white');

    swatch.addEventListener('click', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

    swatch.addEventListener('touchend', event => {
        event.stopPropagation();
        colorHandler(hexColorString);
    });

};

class Popover {

    constructor(parent, isDraggable, title, closeHandler) {

        this.parent = parent;
        
        this.popover = div({ class: "igv-ui-popover" });
        parent.appendChild(this.popover);

        this.popoverHeader = div();
        this.popover.appendChild(this.popoverHeader);

        const titleElement = div();
        this.popoverHeader.appendChild(titleElement);
        if (title) {
            titleElement.textContent = title;
        }

        // attach close handler
        const el = div();
        this.popoverHeader.appendChild(el);
        el.appendChild(createIcon('times'));
        el.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            closeHandler ? closeHandler() : this.dismiss();
        });

        // Optionally make draggable
        if (true === isDraggable) {
            makeDraggable(this.popover, this.popoverHeader);
        }

        this.popoverContent = div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none';


    }

    configure(menuItems) {

        if (0 === menuItems.length) {
            return
        }

        const menuElements = createMenuElements(menuItems, this.popover);

        for (const { object } of menuElements) {
            this.popoverContent.appendChild(object);
        }

    }

    present(event) {

        this.popover.style.display = 'block';

        const parent = this.popover.parentNode;
        const { x, y, width } = translateMouseCoordinates(event, parent);
        this.popover.style.top  = `${ y }px`;

        const { width: w } = this.popover.getBoundingClientRect();

        const xmax = x + w;
        const delta = xmax - width;

        this.popover.style.left = `${ xmax > width ? (x - delta) : x }px`;
        this.popoverContent.style.maxWidth = `${ Math.min(w, width) }px`;
    }

    presentContentWithEvent(e, content) {

        this.popover.style.display = 'block';

        this.popoverContent.innerHTML = content;

        present(e, this.popover, this.popoverContent);

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

        present(e, this.popover, this.popoverContent);
    }

    dismiss() {
        this.popover.style.display = 'none';
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

function present(e, popover, popoverContent) {

    const { x, y, width } = translateMouseCoordinates(e, popover.parentNode);
    popover.style.top  = `${ y }px`;

    const { width: w } = popover.getBoundingClientRect();

    const xmax = x + w;
    const delta = xmax - width;

    popover.style.left = `${ xmax > width ? (x - delta) : x }px`;
    popoverContent.style.maxWidth = `${ Math.min(w, width) }px`;


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

class Dropdown {
    constructor(parent, shim) {

        this.parent = parent;

        // popover
        this.popover = div({ class: "igv-ui-dropdown" });
        parent.appendChild(this.popover);

        // content
        this.popoverContent = div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none';

        this.shim = shim;
    }

    configure(dropdownItems) {

        if (0 === dropdownItems.length) {
            return
        }

        const menuElements = createMenuElements(dropdownItems, this.popover);

        for (const { object } of menuElements) {
            this.popoverContent.appendChild(object);
        }

    }

    present(event) {
        this.popover.style.display = 'block';

        let { x, y } = translateMouseCoordinates(event, this.parent);

        // this.popover.style.left  = `${ x }px`
        // this.popover.style.top  = `${ y }px`

        this.popover.style.left  = `${ x + this.shim.left }px`;
        this.popover.style.top  = `${ y + this.shim.top }px`;
    }

    _present(event) {

        this.popover.style.display = 'block';

        let { x, y, width } = translateMouseCoordinates(event, this.parent);

        x += this.shim.left;
        y += this.shim.top;

        this.popover.style.top  = `${ y }px`;

        const { width: w } = this.popover.getBoundingClientRect();

        const xmax = x + w;
        const delta = xmax - width;

        this.popover.style.left = `${ xmax > width ? (x - delta) : x }px`;

        // this.popoverContent.style.maxWidth = `${ Math.min(w, width) }px`
    }

    dismiss() {
        this.popover.style.display = 'none';
    }
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

class GenericColorPicker extends GenericContainer {

    constructor({parent, width}) {
        super({parent, width, border: '1px solid gray'});
    }

    configure(defaultColors, colorHandlers) {

        this.colorHandlers = colorHandlers;

        // active color handler defaults to handler with 'color' as key
        this.setActiveColorHandler('color');

        this.createSwatches(defaultColors);

    }

    setActiveColorHandler(option) {
        this.activeColorHandler = this.colorHandlers[option];
    }

    createSwatches(defaultColors) {

        this.container.querySelectorAll('.igv-ui-color-swatch').forEach(swatch => swatch.remove());

        const hexColorStrings = Object.values(appleCrayonPalette);

        for (let hexColorString of hexColorStrings) {
            const swatch = div({class: 'igv-ui-color-swatch'});
            this.container.appendChild(swatch);
            this.decorateSwatch(swatch, hexColorString);
        }

        if (defaultColors) {
            for (let hexColorString of defaultColors) {
                const swatch = div({class: 'igv-ui-color-swatch'});
                this.container.appendChild(swatch);
                this.decorateSwatch(swatch, hexColorString);
            }
        }

    }

    decorateSwatch(swatch, hexColorString) {

        swatch.style.backgroundColor = hexColorString;

        swatch.addEventListener('mouseenter', () => swatch.style.borderColor = hexColorString);

        swatch.addEventListener('mouseleave', () => swatch.style.borderColor = 'white');

        swatch.addEventListener('click', event => {
            event.stopPropagation();
            this.activeColorHandler(hexColorString);
        });

        swatch.addEventListener('touchend', event => {
            event.stopPropagation();
            this.activeColorHandler(hexColorString);
        });

    }

}

/**
 * Create a table with an optional row click handler *
 *
 * @param tableConfig {
 *     headers: column headers (strings)
 *     rows: row data (array of arrays, 1 for ecah row)
 *     rowClickHandler:  Optional click handler for a row.  Supplied function will receive a row's data as an array
 * }
 * @returns {HTMLTableElement}
 */
function createTable(tableConfig) {

    const table = document.createElement("table");
    table.classList.add("igv-ui-table");
    table.id = "variant_table";

    const thead = document.createElement('thead');
    table.appendChild(thead);
    const headerRow = thead.insertRow(0);

    const headers = tableConfig.headers;
    for (let j = 0; j < headers.length; j++) {
        var cell = document.createElement("th");
        headerRow.appendChild(cell);
        cell.innerHTML = headers[j];
    }

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    const tableRows = tableConfig.rows;
    for (let rowData of tableRows) {

        const row = document.createElement("tr");
        tbody.appendChild(row);

        for (let j = 0; j < headers.length; j++) {
            var value = rowData[j];
            cell = document.createElement("td");
            row.appendChild(cell);
            cell.innerHTML = value;
        }

        if (tableConfig.rowClickHandler) {
            row.onclick = (event) => {
                tableConfig.rowClickHandler(rowData);
            };
        }
    }

    return table

}

/**
 * Wraps a simple table (see components/table.js) in a popup component with drag bar and close control.  The table
 * is initially hidden (display == none)
 *
 */

class IGVTable {

    /**
     *
     * @param parent - parent element for the popup's html element
     * @param tableConfig - see components/table.js
     */
    constructor(parent, tableConfig) {

        this.parent = parent;

        // popover
        this.popover = div({class: "igv-ui-popover"});
        parent.appendChild(this.popover);

        // header
        const popoverHeader = div();
        this.popover.appendChild(popoverHeader);

        const titleElement = div();
        popoverHeader.appendChild(titleElement);
        if (tableConfig.title) {
            titleElement.innerHTML = tableConfig.title;
        }

        attachDialogCloseHandlerWithParent(popoverHeader, () => this.hide());
        makeDraggable(this.popover, popoverHeader);

        const tableContainer = document.createElement("div");
        tableContainer.style.maxHeight = tableConfig.maxHeight ? tableConfig.maxHeight + "px" : "800px";
        tableContainer.style.overflow = "auto";
        this.popover.appendChild(tableContainer);

        // TODO -- this will be passed as an argument

        const table = createTable(tableConfig);
        tableContainer.appendChild(table);

        this.popover.style.display = 'none';

    }

    show() {
        this.popover.style.display = 'block';
    }

    hide() {
        this.popover.style.display = 'none';
    }

    dispose() {

        if (this.popover) {
            this.popover.parentNode.removeChild(this.popover);
        }
    }

}

function embedCSS() {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('title', 'igv-ui.css');
    style.innerHTML = `.igv-ui-dropdown {
  cursor: default;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2048;
  border-color: #7F7F7F;
  border-style: solid;
  border-width: 1px;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  font-weight: 400;
  background-color: white;
}
.igv-ui-dropdown > div {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
}
.igv-ui-dropdown > div > div {
  padding: 4px;
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  background-color: white;
}
.igv-ui-dropdown > div > div:last-child {
  border-bottom-color: transparent;
  border-bottom-width: 0;
}
.igv-ui-dropdown > div > div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.04);
}

.igv-ui-popover {
  cursor: default;
  position: absolute;
  z-index: 2048;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  background-color: white;
}
.igv-ui-popover > div:first-child {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-popover > div:first-child > div:first-child {
  margin-left: 4px;
}
.igv-ui-popover > div:first-child > div:last-child {
  margin-right: 4px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-popover > div:first-child > div:last-child:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-popover > div:last-child {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px;
  max-width: 800px;
  background-color: white;
}
.igv-ui-popover > div:last-child > div {
  user-select: all;
  margin-left: 4px;
  margin-right: 4px;
  min-width: 220px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.igv-ui-popover > div:last-child > div > span {
  font-weight: bolder;
}
.igv-ui-popover > div:last-child hr {
  width: 100%;
}

.igv-ui-alert-dialog-container {
  box-sizing: content-box;
  position: absolute;
  z-index: 2048;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 200px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  outline: none;
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  font-weight: 400;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.igv-ui-alert-dialog-container > div:first-child {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-alert-dialog-container > div:first-child div:first-child {
  padding-left: 8px;
}
.igv-ui-alert-dialog-container .igv-ui-alert-dialog-body {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  color: #373737;
  width: 100%;
  height: calc(100% - 24px - 64px);
  overflow-y: scroll;
}
.igv-ui-alert-dialog-container .igv-ui-alert-dialog-body .igv-ui-alert-dialog-body-copy {
  margin: 16px;
  width: auto;
  height: auto;
  overflow-wrap: break-word;
  word-break: break-word;
  background-color: white;
  border: unset;
}
.igv-ui-alert-dialog-container > div:last-child {
  width: 100%;
  margin-bottom: 10px;
  background-color: white;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.igv-ui-alert-dialog-container > div:last-child div {
  margin: unset;
  width: 40px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: small;
  font-weight: 400;
  border-color: #2B81AF;
  border-style: solid;
  border-width: thin;
  border-radius: 4px;
  background-color: #2B81AF;
}
.igv-ui-alert-dialog-container > div:last-child div:hover {
  cursor: pointer;
  border-color: #25597f;
  background-color: #25597f;
}

.igv-ui-color-swatch {
  position: relative;
  box-sizing: content-box;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-style: solid;
  border-width: 2px;
  border-color: white;
  border-radius: 4px;
}

.igv-ui-color-swatch:hover {
  border-color: dimgray;
}

.igv-ui-colorpicker-menu-close-button {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 32px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding-right: 8px;
}
.igv-ui-colorpicker-menu-close-button i.fa {
  display: block;
  margin-left: 4px;
  margin-right: 4px;
  color: #5f5f5f;
}
.igv-ui-colorpicker-menu-close-button i.fa:hover,
.igv-ui-colorpicker-menu-close-button i.fa:focus,
.igv-ui-colorpicker-menu-close-button i.fa:active {
  cursor: pointer;
  color: #0f0f0f;
}

.igv-ui-generic-dialog-container {
  box-sizing: content-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: fit-content;
  padding-bottom: 16px;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  z-index: 2048;
  background-color: white;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div {
  margin-right: 4px;
  margin-bottom: 2px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-header div:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-one-liner {
  color: #373737;
  width: 95%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin-top: 8px;
  padding-left: 8px;
  overflow-wrap: break-word;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input {
  margin-top: 8px;
  width: 95%;
  height: 24px;
  color: #373737;
  line-height: 24px;
  padding-left: 8px;
  background-color: white;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input > div {
  width: fit-content;
  height: 100%;
  font-size: 16px;
  text-align: right;
  padding-right: 8px;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {
  display: block;
  height: 100%;
  width: 100%;
  padding-left: 4px;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: #373737;
  text-align: left;
  outline: none;
  border-style: solid;
  border-width: thin;
  border-color: #7F7F7F;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-label-input input {
  width: 50%;
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input {
  margin-top: 8px;
  width: calc(100% - 16px);
  height: 24px;
  color: #373737;
  line-height: 24px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {
  display: block;
  height: 100%;
  width: 100%;
  padding-left: 4px;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  color: #373737;
  text-align: left;
  outline: none;
  border-style: solid;
  border-width: thin;
  border-color: #7F7F7F;
  background-color: white;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input {
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input input[type=range] {
  width: 70%;
  -webkit-appearance: none;
  background: linear-gradient(90deg, white, black);
  outline: none;
  margin: 0;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-input output {
  display: block;
  height: 100%;
  width: 20%;
  font-size: 16px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel {
  width: 100%;
  height: 28px;
  padding-top: 16px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div {
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-color: transparent;
  border-style: solid;
  border-width: thin;
  border-radius: 2px;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:first-child {
  margin-left: 32px;
  margin-right: 0;
  background-color: #5ea4e0;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:last-child {
  margin-left: 0;
  margin-right: 32px;
  background-color: #c4c4c4;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:first-child:hover {
  cursor: pointer;
  background-color: #3b5c7f;
}
.igv-ui-generic-dialog-container .igv-ui-generic-dialog-ok-cancel > div:last-child:hover {
  cursor: pointer;
  background-color: #7f7f7f;
}

.igv-ui-generic-container {
  box-sizing: content-box;
  position: absolute;
  z-index: 2048;
  background-color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.igv-ui-generic-container > div:first-child {
  cursor: move;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  height: 24px;
  width: 100%;
  background-color: #dddddd;
}
.igv-ui-generic-container > div:first-child > div {
  display: block;
  color: #5f5f5f;
  cursor: pointer;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-bottom: 4px;
}

.igv-ui-dialog {
  z-index: 2048;
  position: fixed;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-flow: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background-color: white;
  border-color: #7F7F7F;
  border-radius: 4px;
  border-style: solid;
  border-width: thin;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
}
.igv-ui-dialog .igv-ui-dialog-header {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 24px;
  cursor: move;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-color: #7F7F7F;
  border-bottom-style: solid;
  border-bottom-width: thin;
  background-color: #eee;
}
.igv-ui-dialog .igv-ui-dialog-header div {
  margin-right: 4px;
  margin-bottom: 2px;
  height: 12px;
  width: 12px;
  color: #7F7F7F;
}
.igv-ui-dialog .igv-ui-dialog-header div:hover {
  cursor: pointer;
  color: #444;
}
.igv-ui-dialog .igv-ui-dialog-one-liner {
  width: 95%;
  height: 24px;
  line-height: 24px;
  text-align: left;
  margin: 8px;
  overflow-wrap: break-word;
  background-color: white;
  font-weight: bold;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel {
  width: 100%;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div {
  margin: 16px;
  margin-top: 32px;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-color: transparent;
  border-style: solid;
  border-width: thin;
  border-radius: 2px;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child {
  background-color: #5ea4e0;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child {
  background-color: #c4c4c4;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:first-child:hover {
  cursor: pointer;
  background-color: #3b5c7f;
}
.igv-ui-dialog .igv-ui-dialog-ok-cancel div:last-child:hover {
  cursor: pointer;
  background-color: #7f7f7f;
}
.igv-ui-dialog .igv-ui-dialog-ok {
  width: 100%;
  height: 36px;
  margin-top: 32px;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.igv-ui-dialog .igv-ui-dialog-ok div {
  width: 98px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  border-color: white;
  border-style: solid;
  border-width: thin;
  border-radius: 4px;
  background-color: #2B81AF;
}
.igv-ui-dialog .igv-ui-dialog-ok div:hover {
  cursor: pointer;
  background-color: #25597f;
}

.igv-ui-panel, .igv-ui-panel-row, .igv-ui-panel-column {
  z-index: 2048;
  background-color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.igv-ui-panel-column {
  display: flex;
  flex-direction: column;
}

.igv-ui-panel-row {
  display: flex;
  flex-direction: row;
}

.igv-ui-textbox {
  background-color: white;
  font-family: "Open Sans", sans-serif;
  font-size: medium;
  font-weight: 400;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.igv-ui-table {
  background-color: white;
}

.igv-ui-table thead {
  position: sticky;
  top: 0;
}

.igv-ui-table th {
  text-align: left;
}

.igv-ui-table td {
  padding-right: 20px;
}

.igv-ui-table tr:hover {
  background-color: lightblue;
}

/*# sourceMappingURL=igv-ui.css.map */
`;
    document.head.append(style);
}

if (typeof document !== 'undefined') {

    if (!stylesheetExists("igv-ui.css")) {
        embedCSS();
    }

    function stylesheetExists(stylesheetName) {
        for (let ss of document.styleSheets) {
            ss = ss.href ? ss.href.replace(/^.*[\\\/]/, '') : '';
            if (ss === stylesheetName) {
                return true
            }
        }
        return false
    }
}

export { Alert, AlertDialog, alertSingleton as AlertSingleton, Checkbox, ColorPicker, domUtils as DOMUtils, DataRangeDialog, Dialog, Dropdown, GenericColorPicker, GenericContainer, IGVTable, icons$1 as Icon, InputDialog, PaletteColorTable, Panel, Popover, SliderDialog, Textbox, uiUtils as UIUtils, appleCrayonPalette, createColorSwatchSelector, makeDraggable, nucleotideColorComponents, nucleotideColors };
