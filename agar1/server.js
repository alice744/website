var express = require('express');
var app = express();
var server = app.listen(process.env.PORT);

app.use(express.static('public'));
console.log('server running')

var socket = require('socket.io');
var io = socket(server);

var blobs = [];

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: ' + socket.id)

  // when the client code (sketch.js) emits these this server code will do this
	socket.on('agario-start', agarioStart)
	socket.on('agario-update', agarioUpdate)
	socket.on('eaten', eaten)

	function agarioStart(data){
		console.log(socket.id + " " + data.x + " " + data.y + " " +data.r)
	}

	function agarioUpdate(data){
    socket.broadcast.emit('update-other-players', data); // отправить всем, кроме отправителя
	}

  // сообщение "тебя съели"
	function eaten(data){
		socket.broadcast.to(data.id).emit('eaten', true)
    //removeBlob(data.id);
	}
	// function removeBlob(whichBlob){
	// 	for (var i = 0; i < blobs.length; i++) {
	// 		if(whichBlob == blobs[i].id){
	// 			blobs.splice(i, 1)
	// 			console.log('disconnected')
	// 			break
	// 		}
	// 	}
	// }

}
