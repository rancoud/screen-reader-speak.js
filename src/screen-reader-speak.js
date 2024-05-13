/** @type {number} */
var timeInMsBeforeAddingText = 100;
/** @type {number} */
var timeInMsBeforeRemovingDiv = 1000;

/**
 * Main entry.
 *
 * @function screenReaderSpeak
 * @global
 * @param {string} text       - text to read for screen reader
 * @param {string} [priority] - the priority for screen reader to read text
 * @returns {(TypeError|ReferenceError|undefined)} TypeError is returned when `text` or `priority` argument is invalid.
 * ReferenceError is returned when there is no document.body.
 */
function screenReaderSpeak(text, priority) {
    /** @type {string} */
    var id;
    /** @type {string} */
    var priorityToUse;

    if (typeof text !== "string") {
        return new TypeError("Invalid argument text, expect string, get " + typeof text);
    }

    priorityToUse = priority || "polite";
    if (typeof priorityToUse !== "string") {
        return new TypeError("Invalid argument priority, expect string, get " + typeof priorityToUse);
    }

    if (!document.body) {
        return new ReferenceError("document.body not exist");
    }

    id = insertDivInDom(priorityToUse);
    addTextInDivAfter100ms(id, text);
    deleteDivAfter1000ms(id);

    return undefined;
}

/**
 * Creates a div with priority and inserts it in dom.
 *
 * @function insertDivInDom
 * @param {string} priority - the priority for screen reader to read text
 * @returns {string} id of the div following that pattern: `speak-` + Date.now()
 * @private
 */
function insertDivInDom(priority) {
    /** @type {HTMLDivElement} */
    var div = document.createElement("div");
    /** @type {string} */
    var id = "speak-" + Date.now();

    div.setAttribute("id", id);
    div.setAttribute("aria-live", getPriority(priority));
    div.classList.add("sr-only");

    document.body.appendChild(div);

    return id;
}

/**
 * Search valid value for priority, fallback is `polite`.
 *
 * @function getPriority
 * @param {string} priority - the priority for screen reader to read text
 * @returns {string} the priority for screen reader to read text
 * @private
 */
function getPriority(priority) {
    /** @type {string[]} */
    var props = ["off", "polite", "assertive"];
    /** @type {number} */
    var idxProp = 0;
    /** @type {number} */
    var maxProps = props.length;
    /** @type {string} */
    var priorityToMatch = priority.toLowerCase();

    for (; idxProp < maxProps; ++idxProp) {
        if (props[idxProp] === priorityToMatch) {
            return props[idxProp];
        }
    }

    return "polite";
}

/**
 * Add text in div after 100ms.
 *
 * @function addTextInDivAfter100ms
 * @param {string} id   - id of the div
 * @param {string} text - text to read for screen reader
 * @returns {undefined}
 * @private
 */
function addTextInDivAfter100ms(id, text) {
    setTimeout(function setTextInDiv() {
        /** @type {(HTMLElement|null)} */
        var elem = document.getElementById(id);
        if (elem) {
            elem.appendChild(document.createTextNode(text));
        }
    }, timeInMsBeforeAddingText);

    return undefined;
}

/**
 * Remove div after 1000ms.
 *
 * @function deleteDivAfter1000ms
 * @param {string} id - id of the div
 * @returns {undefined}
 * @private
 */
function deleteDivAfter1000ms(id) {
    setTimeout(function removeEntireDiv() {
        /** @type {(HTMLElement|null)} */
        var elem = document.getElementById(id);
        if (document.body && elem) {
            document.body.removeChild(elem);
        }
    }, timeInMsBeforeRemovingDiv);

    return undefined;
}

Object.freeze(screenReaderSpeak.prototype);
Object.freeze(screenReaderSpeak);

window.screenReaderSpeak = screenReaderSpeak;
