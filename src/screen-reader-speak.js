/**
 * Main entry.
 *
 * @param {string} text       - text to read for screen reader
 * @param {string} [priority] - the priority for screen reader to read text
 * @returns {undefined|TypeError|ReferenceError} TypeError is returned when `text` or `priority` argument is invalid.
 * ReferenceError is returned when there is no document.body.
 */
function screenReaderSpeak(text, priority) {
    var id = "";
    var priorityToUse = "";

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
}

/**
 * Creates a div with priority and inserts it in dom.
 *
 * @param {string} priority - the priority for screen reader to read text
 * @returns {string} id of the div following that pattern: `speak-` + Date.now()
 */
function insertDivInDom(priority) {
    var div = document.createElement("div");
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
 * @param {string} priority - the priority for screen reader to read text
 * @returns {string} the priority for screen reader to read text
 */
function getPriority(priority) {
    var props = ["off", "polite", "assertive"];
    var idxProp = 0;
    var maxProps = props.length;
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
 * @param {string} id   - id of the div
 * @param {string} text - text to read for screen reader
 * @returns {undefined}
 */
function addTextInDivAfter100ms(id, text) {
    setTimeout(function setTextInDiv() {
        var elem = document.getElementById(id);
        if (elem) {
            elem.appendChild(document.createTextNode(text));
        }
    }, 100);
}

/**
 * Remove div after 1000ms.
 *
 * @param {string} id - id of the div
 * @returns {undefined}
 */
function deleteDivAfter1000ms(id) {
    setTimeout(function removeEntireDiv() {
        var elem = document.getElementById(id);
        if (document.body && elem) {
            document.body.removeChild(elem);
        }
    }, 1000);
}

window.screenReaderSpeak = screenReaderSpeak;
