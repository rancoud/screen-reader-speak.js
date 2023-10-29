/**
 * screen-reader-speak.js (v1.0.1)
 * https://github.com/rancoud/screen-reader-speak.js
 * 
 * MIT License
 * 
 * Copyright (c) 2023 Rancoud
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  "use strict";

  /**
   * Main entry.
   *
   * @function screenReaderSpeak
   * @global
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
   * @function insertDivInDom
   * @private
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
   * @function getPriority
   * @private
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
   * @function addTextInDivAfter100ms
   * @private
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
   * @function deleteDivAfter1000ms
   * @private
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

  Object.freeze(screenReaderSpeak.prototype);
  Object.freeze(screenReaderSpeak);

  window.screenReaderSpeak = screenReaderSpeak;

})();