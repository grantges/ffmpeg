//const ffmpeg = require('fluent-ffmpeg');
const FFMpeg = require('./lib/ffmpeg');

const ff = new FFMpeg('../Sample-Video-File-For-Testing.mp4')
ff.output('../output.mp4');
ff.drawText({
    outputs: 'tmp',
    text:"Hello World",
    fadeIn: true
});

ff.addImage({
    inputs:"tmp",
    file: '../download.jpeg',
});
ff.run();
