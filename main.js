var express = require('express');
//var app = express();
//var server = require('http').createServer(app);
//var io = require('socket.io')(server);

var io = require('socket.io')({
    transports: ['websocket']
});


io.attach(process.env.PORT || 5000);

io.set('origins', 'http://minorga.skrin.de:80');

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.to(data.projectId).emit('new message', {message: data});

//        socket.broadcast.emit('new message', {
//            username: socket.username,
//            message: data
//        });
        //insert(socket.username);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('addMe', function (data) {
        socket.join(data.projectId);
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});