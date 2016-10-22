"use strict";
const electron_1 = require('electron');
const fs_1 = require('fs');
const SECRET_KEY = 'ELECTRON_APP_SHELL';
const title = document.title;
document.title = SECRET_KEY;
electron_1.desktopCapturer.getSources({ types: ['window', 'screen'] }, (error, sources) => {
    if (error)
        throw error;
    console.log('sources', sources);
    for (let i = 0; i < sources.length; ++i) {
        let src = sources[i];
        if (src.name === SECRET_KEY) {
            document.title = title;
            navigator.webkitGetUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: src.id,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            }, gotStream, getUserMediaError);
            return;
        }
    }
});
function gotStream(stream) {
    console.log(typeof stream, stream);
    let recorder = new MediaRecorder(stream);
    let blobs = [];
    recorder.ondataavailable = (event) => {
        blobs.push(event.data);
    };
    recorder.start();
    setTimeout(() => {
        recorder.stop();
        console.log('captured ' + blobs.length);
        const w = window;
        w.blobs = blobs;
        toArrayBuffer(new Blob(blobs, { type: 'video/webm' }), function (ab) {
            const buffer = toBuffer(ab);
            fs_1.writeFile('./videos/video5.webm', buffer, err => {
                if (err) {
                    alert('Failed to save video ' + err);
                }
                else {
                    console.log('Saved video!');
                }
            });
        });
    }, 5000);
}
function getUserMediaError(e) {
    console.log('getUserMediaError', e);
    throw e;
}
function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
}
function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}
function toBufferConcat(abArray) {
    let len = 0;
    abArray.forEach(ab => { len += ab.byteLength; });
    let buffer = new Buffer(len);
    let bIndex = 0;
    for (let ab of abArray) {
        let arr = new Uint8Array(ab);
        for (let aIndex = 0; aIndex < arr.byteLength; aIndex++) {
            buffer[bIndex] = arr[aIndex];
            bIndex++;
        }
    }
    return buffer;
}
