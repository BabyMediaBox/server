const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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

io.on('connection', (socket) => {
    socket.on('play_media', function( data ){
        socket.broadcast.emit('play_media', data);
    });
});