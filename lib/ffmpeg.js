const ffmpeg = require('fluent-ffmpeg');

module.exports = class FFMpeg {

    ffmpegCommand = null;
    filters = [];

    constructor ( video ) {
        this.ffmpegCommand = ffmpeg(video);
    }

    addInput(file) {
        this.ffmpegCommand.input(file);
    }

    addImage(options) {

        this.addInput(options.file);        

        let filterImage = {
            filter: "overlay",
            options: {
              enable: "between(t,2,4)",
              x: "810",
              y: "465",
            },
            inputs: options.inputs || null,
            outputs: options.outputs || null,
          };

        //this.ffmpegCommand.complexFilter([filterImage])
        this.filters.push(filterImage);
    }

    drawText(options) {

        if(!options.text) {
            
            const err = new Error("`text` parameter is required. Please ensure you are passing this a part of your `options` object.");
            throw(err);
            return err;
        }

        let filterDrawText = {
            filter:'drawtext', 
            options: {
                fontfile: options.font || 'Arial',
                text: options.text,
                fontsize: options.fontSize || 50,
                fontcolor: options.fontColor || 'white',
                x: 100,
                y: 100
            },
            inputs: options.inputs || null,
            outputs: options.outputs || null,
        };

        if(options.fadeIn) {

            const DS = options.fadeIn.displayStart || 1.0;     // display start
            const DE = options.fadeIn.displayEnd || 10.0;    // display end
            const FID= options.fadeIn.fadeInDuration || 0.5;    //fade in duration
            const FOD= options.fadeIn.fadeOutDuration ||0.5     //fade out duration   

            filterDrawText.options.alpha = `if(lt(t,${DS}),0,if(lt(t,${DS+FID}),(t-${DS})/${FID},if(lt(t,${DE+FID}),1,if(lt(t,${DE+DS+FID+FOD}),(${FID}-(t-${DS+DE+FOD}))/${FOD},0))))`;
        
        }

        //this.ffmpegCommand.complexFilter([filterDrawText]);
        this.filters.push(filterDrawText);
    }

    output(outputFile) {
        this.ffmpegCommand.output(outputFile);
    }

    run() {
        //processs filters first.
        if(this.filters.length);
            this.ffmpegCommand.complexFilter(this.filters);

        this.ffmpegCommand.run();
    }
}