const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const fs = require('fs');
const Config = require('./config.json');
const prettyMs = require('pretty-ms');

const PlaylistDir = __dirname + "/public/playlists/";
const VideosDir = __dirname + "/public/videos/";

let volume = 0;
let kioskSerialConnected = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

server.listen( Config.port, () => {
    console.log("server started");
});

app.use( express.static('public') );

app.set('view engine', 'ejs');

// Used in the kiosk client
app.get('/', (req, res) => {
    res.render('index');
});

// Used by parents
app.get('/remote', (req, res) => {
   res.render('remote', {
       volume: volume,
       kioskSerialConnected: kioskSerialConnected
   });
});

let formatPlaylist = function( file )
{
    let fileData = JSON.parse( fs.readFileSync(PlaylistDir + file ));

    let playlist = {
        name: fileData.name,
        description: fileData.description,
        file: file,
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
        if( /\.json/.exec(file) )
        {
            formated.push( formatPlaylist(file) );
        }
    });

    res.json( formated );
});

app.get('/kiosk-buttons', (req, res) => {
    let list = [];
    if( Config['buttons'])
    {
        list = Config['buttons'];
    }
   res.json(list)
});

app.post('/kiosk-volume', (req, res) => {
    if( req.body.volume )
    {
        volume = Math.floor(parseInt(req.body.volume)/10)*10;
        console.log("receive kiosk volume", volume);
        io.sockets.emit('kiosk_volume', volume );
        res.send('ok');
    }
    else
    {
        res.send('fail');
    }
});

app.post('/kiosk-serial-online', (req, res) => {
    kioskSerialConnected = true;
    io.sockets.emit('kiosk_serial_online');
    res.send('ok');
});

app.get('/videos', (req, res) => {
    let files = fs.readdirSync(VideosDir, {});
    let videos = [];

    files.forEach( ( file ) => {
        if( /\.json/.exec(file) )
        {
            let fileData = JSON.parse( fs.readFileSync( VideosDir + file ));
            videos.push( fileData );
        }
    });

    res.json( videos );
});

app.post('/button/:button', (req, res) => {
    console.log("button pressed", req.params.button, req.body );
    if( req.body.item )
    {
        io.sockets.emit('button_pressed', req.body.item );
    }
    res.send('ok');
});

io.on('connection', (socket) => {
    socket.on('request_kiosk_shutdown', function(){
        socket.broadcast.emit('kiosk_shutdown');
    });
    socket.on('request_setting_kiosk_volume', function(data) {
       socket.broadcast.emit('set_kiosk_volume', data);
    });
    socket.on('play_media', function( data ){
        socket.broadcast.emit('play_media', data);
    });
    socket.on('remote_reload_kiosk_page', function(){
        socket.broadcast.emit('reload_page');
    });
    socket.on('remote_test_rgb', function(){
        socket.broadcast.emit('test_rgb');
    });
    socket.on('remote_test_rgb_sequence', function(){
        socket.broadcast.emit('test_rgb_sequence');
    });
});