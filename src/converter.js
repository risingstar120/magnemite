"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = function (ev) {
            let arrayBuffer = this.result;
            resolve(arrayBuffer);
        };
        fileReader.readAsArrayBuffer(blob);
    });
}
exports.toArrayBuffer = toArrayBuffer;
function toTypedArray(ab) {
    return new Uint8Array(ab);
}
exports.toTypedArray = toTypedArray;
function toBuffer(ab) {
    let buffer = Buffer.alloc(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}
exports.toBuffer = toBuffer;
