const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const prettyMs = require('pretty-ms');
const VideosDir = path.resolve( process.env.NODE_PATH + "/public/videos");

let files = fs.readdirSync(VideosDir, {});

files.forEach( ( file ) =>
{
    let filePath = VideosDir + '/' + file ;
    let fileMetaPath = VideosDir+'/'+file+'.json';
    if (/\.mp4|m4v|mkv|webm/.exec(file) && fs.existsSync( fileMetaPath ) === false && /\.json/.exec(file) === null )
    {
        let fileMeta = {
            "name" : file,
            "file": file,
            "_duration": "",
            "duration" : 0
        };
        console.log("file: ", file);

        ffmpeg.ffprobe( filePath ,function(err, metadata) {
            let format = metadata.format;
            fileMeta.duration = Math.ceil(format.duration);
            fileMeta._duration = prettyMs( fileMeta.duration * 1000);
            fs.writeFileSync(fileMetaPath, JSON.stringify(fileMeta, null, 4));
        });
    }
});