# screen-reader-speak.js

[![Test workflow](https://img.shields.io/github/actions/workflow/status/rancoud/screen-reader-speak.js/test.yml?branch=master)](https://github.com/rancoud/screen-reader-speak.js/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/rancoud/screen-reader-speak.js?logo=codecov)](https://codecov.io/gh/rancoud/screen-reader-speak.js)
Accessibility for Screen Reader to speak.  
Based on the work of [Orange a11y guidelines](https://a11y-guidelines.orange.com/fr/web/exemples-de-composants/faire-parler-le-lecteur-d-ecran/)

## Installation
You need to download the js file from `dist` folder, then you can include it in your HTML.
````html
<script src="/screen-reader-speak.min.js"></script>
````

## How to use it?
```js
// Screen Reader use Polite priority by default
screenReaderSpeak('my text');

// Use Assertive priority
screenReaderSpeak('my other text', 'assertive');
```

## Functions
* screenReaderSpeak(text: string, [priority: ?string = polite]): TypeError|ReferenceError|undefined

## Arguments explanations
The first argument is the text that screen reader will read.  
The second argument is the priority for screen reader to read this text.  
By default it will use `polite`, but you can use:
* `off`: the text will be read if user is currently focused on that region.
* `polite`: the text will be read at the end of the current sentence or when the user pauses typing.
* `assertive`: the text will be read immediately, causing an interruption.

## How it works
1. Append a div to the body:  
   `<div id="speak-1638614923710" class="sr-only" aria-live="polite"></div>`
2. Wait 100ms
3. Add text in the div (no HTML)
4. Wait 1000ms
5. Destroy the div

Because it adds a div in DOM, I suggest this css to hide it.
```css
.sr-only {
    border: 0;
    clip: rect(0,0,0,0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}
```

## How to Dev
`npm test` or `docker buildx bake test` to test and coverage  
`npm run build` or `docker buildx bake build` to create dist js file minified  
`npm run jsdoc` or `docker buildx bake jsdoc` to generate documentation  
`npm run eslint` or `docker buildx bake lint` to run eslint  
`npm run eslint:fix` to run eslint and fix files
