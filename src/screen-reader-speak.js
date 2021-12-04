(function(){
    'use strict';

    function screenReaderSpeak(text, priority) {
        if (typeof text !== 'string') {
            return new TypeError('Invalid argument text, expect string, get ' + typeof text);
        }

        priority = priority || 'polite';
        if (typeof priority !== 'string') {
            return new TypeError('Invalid argument priority, expect string, get ' + typeof priority);
        }

        if (!document.body) {
            return new ReferenceError('document.body not exist');
        }

        var id = insertDivInDom(priority);
        addTextInDivAfter100ms(id, text);
        deleteDivAfter1000ms(id);
    }

    function insertDivInDom(priority) {
        var div = document.createElement('div');
        var id = 'speak-' + Date.now();
        div.setAttribute('id', id);
        div.setAttribute('aria-live', getPriority(priority));
        div.classList.add('sr-only');
        document.body.appendChild(div);

        return id;
    }

    function getPriority(priority) {
        var props = ['off', 'polite', 'assertive'];
        var i = 0;
        var max = props.length;
        priority = priority.toLowerCase();

        for (; i < max; ++i) {
            if (props[i] === priority) {
                return props[i];
            }
        }

        return 'polite';
    }

    function addTextInDivAfter100ms(id, text) {
        setTimeout(function () {
            var elem = document.getElementById(id);
            if (elem) {
                elem.appendChild(document.createTextNode(text));
            }
        }, 100);
    }

    function deleteDivAfter1000ms(id) {
        setTimeout(function () {
            var elem = document.getElementById(id);
            if (document.body && elem) {
                document.body.removeChild(elem);
            }
        }, 1000);
    }

    window.screenReaderSpeak = screenReaderSpeak;
})();