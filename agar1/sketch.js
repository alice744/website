var you;
var lilFood = [];
var players = [];
var zoom = 1;
var socket = io();
var foodSize = 6;
var arenaW, arenaH;

function setup(){

  createCanvas(windowWidth,windowHeight);
  arenaW = 600;
  arenaH = 600;
	socket.on('connect', function() {
    you = new Thing(random(arenaW), random(arenaH), random(8,24), socket.id);
    socket.emit('agario-start', you.data) // tell the server "this is me!"
  });
  if (socket.id){ // if youre not the first conncetion ever, the server wont emit connect
    you = new Thing(random(width), random(height), random(8,24), socket.id);
    socket.emit('agario-start', you.data) // tell the server "this is me!"
  }

  // init food
	for (var i = 0; i < 50; i++) {
		var x = random(-arenaW, arenaW)
		var y = random(-arenaH, arenaH)
		lilFood[i] = new Thing(x, y, foodSize);
	}

  // this defines what to do whatn server updating you on all the rest of the blobs
	socket.on('update-other-players', function(data){
    if (!players[data.id]){
      players[data.id]= new Thing(data.x,data.y,data.r,data.id);
    }
    else{
		  players[data.id].updateUsingData(data);
    }
	})

	socket.on('eaten', function(data){ // set a flag that you have been eaten
		you.r = 0;
	})


}
function drawGrid(){

  stroke(50);
  for ( var x = -arenaW; x <= arenaW; x= x +(arenaW/10)){
    line(x,-arenaH,x,arenaH);
    for ( var y = -arenaH; y <= arenaH; y= y+(arenaH/10)){
      line(-arenaW,y,arenaW,y);
    }
  }
}

function draw(){
  if(!you){
    text("waiting for socket.io",width/2,height/2);
    return;
  }
  if (you.r == 0){ // flag that you have been eatern
    textSize(20);
    fill(255)
    background(20,10)
    text("Alas, you have been eaten.",width/2,height/2);
    return;
  }
	background(0);
	translate(width/2, height/2)
	var newzoom = 32 / you.r; // this is so you always fit on the screen
	zoom = lerp(zoom, newzoom, 0.1)

	scale(zoom)
	translate(-you.pos.x, -you.pos.y) // center on blob

  drawGrid();

  // you is a Thing, check out Thing.js to see what these do
	you.update();
	you.constrain();
	you.show();

  socket.emit('agario-update', you.data); // tell the server where you at

  if(socket.id){ // draw your name
		textAlign(CENTER);
		textSize(you.r * 0.6);
		text(socket.id.slice(-5), you.pos.x, you.pos.y + you.r * 2 + 10)
	}

  // draw other players
	for (var i in players) { // THIS FOR LOOP IS A COOL JAVASCRIPT THING, we are now indexing by the ID instead of by its place in the list
		if(players[i].id == socket.id || players[i].r == 0){continue;} // it is you, you already drew yourself
		players[i].show()
    fill(255);
		textSize(players[i].r * 0.6);// draw players name
		text(players[i].id.slice(-5), players[i].pos.x, players[i].pos.y + players[i].r * 2 + 10)

		if(you.eats(players[i])){
			var data = {id: players[i].id}
			socket.emit('eaten', data); // say to the server "I have eaten this other client"
			players[i].r = 0;
		}
	}
	for (var i = 0; i < lilFood.length; i++) { // draw the lil food bits
		lilFood[i].show()
		if(you.eats(lilFood[i])){
		  var x = random(-arenaW, arenaW)
		  var y = random(-arenaH, arenaH)
			lilFood[i] = new Thing(x, y, foodSize);
		}
	}
}
