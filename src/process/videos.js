const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const prettyMs = require('pretty-ms');
const VideosDir = path.resolve( process.env.NODE_PATH + "/public/videos");

let files = fs.readdirSync(VideosDir, {});
let skipped = 0;
let processed = 0;

function writeMetaFile( converteFileName, convertedFilePath, fileMetaPath)
{
    let fileMeta = {
            "name" : converteFileName,
            "file": converteFileName,
            "src" : "videos/"+converteFileName,
            "type" : 1,
            "rbgList" : [],
            "_duration": "",
            "duration" : 0
        };

    ffmpeg.ffprobe( convertedFilePath ,function(err, metadata) {
        let format = metadata.format;
        fileMeta.duration = Math.ceil(format.duration);
        fileMeta._duration = prettyMs( fileMeta.duration * 1000);

        let randomDuration = 0;
        let step = 0;
        while( randomDuration < fileMeta.duration )
        {
            step = Math.floor(Math.random() * 25) + 5;
            fileMeta.rbgList.push({
                r : Math.floor(Math.random() * 256),
                g : Math.floor(Math.random() * 256),
                b : Math.floor(Math.random() * 256),
                stepTime: step,
                startTime: randomDuration
            });
            randomDuration+= step;
        }

        fs.writeFileSync(fileMetaPath, JSON.stringify(fileMeta, null, 4));
    });
}

files.forEach( ( file ) =>
{
    let filePath = VideosDir + '/' + file ;
    let extentionTest =  /\mp4|m4v|mkv|webm/.exec(file);
    if ( extentionTest && /\.json/.exec(file) === null )
    {

        let converteFileName = file.substr(0, extentionTest.index)+"webm";
        let convertedFilePath = VideosDir+'/'+converteFileName;
        let fileMetaPath = VideosDir+'/'+converteFileName+'.json';
        

        if( fs.existsSync( fileMetaPath ) === false )
        {
            console.log("file: ", file);

            if(/\.webm/.exec(file))
            {
                writeMetaFile(converteFileName, convertedFilePath, fileMetaPath);
            }
            else
            {
                ffmpeg(filePath)
                    .size("1024x?")
                    .videoBitrate('1024k')
                    .videoCodec('libvpx-vp9')
                    .on('start', function(commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + commandLine);
                    })
                    .on('error', function(err) {
                        console.log("error", err);
                    })
                    .on('end', function(){
                        writeMetaFile(converteFileName, convertedFilePath, fileMetaPath);
                        /*ffmpeg.ffprobe( convertedFilePath ,function(err, metadata) {
                            let format = metadata.format;
                            fileMeta.duration = Math.ceil(format.duration);
                            fileMeta._duration = prettyMs( fileMeta.duration * 1000);

                            let randomDuration = 0;
                            let step = 0;
                            while( randomDuration < fileMeta.duration )
                            {
                                step = Math.floor(Math.random() * 25) + 5;
                                fileMeta.rbgList.push({
                                    r : Math.floor(Math.random() * 256),
                                    g : Math.floor(Math.random() * 256),
                                    b : Math.floor(Math.random() * 256),
                                    stepTime: step,
                                    startTime: randomDuration
                                });
                                randomDuration+= step;
                            }

                            fs.writeFileSync(fileMetaPath, JSON.stringify(fileMeta, null, 4));
                        });*/
                    })
                    .save(convertedFilePath);
            }
            
            
            
        }
        else
        {
            skipped++;
        }
    }
});