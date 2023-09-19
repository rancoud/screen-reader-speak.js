const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// list of JS files to concat
const inputJSFiles = [
    path.join(__dirname, 'src/screen-reader-speak.js')
];

// output JS file
const outputJSFilename = 'dist/screen-reader-speak.js';

const outputJSFileContent = concatJSFiles(inputJSFiles);
const outputJSFileContentStripped = removeDebug(outputJSFileContent);
saveFile(outputJSFilename, outputJSFileContentStripped);

// functions below

function concatJSFiles(files) {
    let outputFileContent = ['(function () {'];
    outputFileContent.push('"use strict";' + "\n");

    for(let idxFiles = 0, maxFiles = files.length; idxFiles < maxFiles; ++idxFiles) {
        outputFileContent.push(fs.readFileSync(files[idxFiles]).toString('utf8'));
    }

    outputFileContent.push('})();');

    return outputFileContent.join("\n");
}

function removeDebug(content) {
    function getNode(node) {
        if (node.isMemberExpression()) {
            const object = node.get('object');
            if (object.isIdentifier() && node.has('property')) {
                return node.get('property');
            }
        }

        return node;
    }

    function isConsole(nodePath) {
        const callee = nodePath.get('callee');

        if (!callee.isMemberExpression()) {
            return;
        }

        return getNode(callee.get('object')).isIdentifier({name: 'console'}) && callee.has('property');
    }

    function isAlert(nodePath) {
        return getNode(nodePath.get('callee')).isIdentifier({name: 'alert'});
    }

    return babel.transformSync(content, {
        retainLines: true,
        plugins:[{
            visitor: {
                DebuggerStatement(nodePath) {
                    nodePath.remove();
                },
                CallExpression(nodePath) {
                    if (isConsole(nodePath) || isAlert(nodePath)) {
                        nodePath.remove();
                    }
                }
            },
        }]
    }).code;
}

function saveFile(filename, content) {
    fs.writeFileSync(filename, content);
}
