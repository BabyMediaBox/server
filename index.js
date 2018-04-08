const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const prettyMs = require('pretty-ms');

const PlaylistDir = __dirname + "/public/playlists/";

server.listen(3010);

app.use( express.static('public') );

app.set('view engine', 'ejs');

// Used in the kiosk client
app.get('/', (req, res) => {
    res.render('index');
});

// Used by parents
app.get('/remote', (req, res) => {
   res.render('remote');
});

let formatPlaylist = function( file )
{
    let fileData = JSON.parse( fs.readFileSync(PlaylistDir + file ));

    let playlist = {
        name: fileData.name,
        description: fileData.description,
        list: [],
        duration: 0,
        _duration: ""
    };
    fileData.list.forEach( (item) => {
        playlist.duration += item.duration;
        item._duration = prettyMs( item.duration * 1000);
        playlist.list.push( item );
    });
    playlist._duration = prettyMs( playlist.duration * 1000);
    return playlist;
};

app.get('/playlists/:playlist', (req, res) => {
    let playlist = formatPlaylist( req.params.playlist );
    res.json( playlist );
});

app.get('/playlists', (req, res) => {
    let files = fs.readdirSync(PlaylistDir, {});
    let formated = [];
    files.forEach( ( file ) => {
        formated.push( formatPlaylist(file) );
    });

    res.json( formated );
});

io.on('connection', (socket) => {
    socket.on('play_media', function( data ){
        socket.broadcast.emit('play_media', data);
    });
});