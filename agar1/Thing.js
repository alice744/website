function Thing(x, y, r, id){
	this.pos = createVector(x, y);
	this.vel = createVector(0,0);
	this.r = r;
  this.c = [random(100,255),random(100,255),random(100,255)];
  this.id = id;
  this.data = {x:this.pos.x, y:this.pos.y, r:this.r, id:this.id}

	this.update = function(){
		var newVel = createVector(mouseX-width/2,mouseY-height/2);
		newVel.setMag((dist(mouseX, mouseY, width/2,height/2))/(height/2));
    //this ^ speeds up blob if ur mouse is farther away
		newVel.setMag(2);
    this.vel.lerp(newVel, 0.2)
		this.pos.add(this.vel);
    this.data = {x:this.pos.x, y:this.pos.y, r:this.r, id:this.id};
	}
  this.updateUsingData = function(data){
    this.pos = createVector(data.x, data.y);
	  this.r = data.r;
    this.id = data.id;
    this.data = data;

  }

	this.eats = function(other){
		var d = p5.Vector.dist(this.pos,other.pos);
		if(this.r > other.r && d <= this.r){
			var sum = PI * this.r * this.r + PI * other.r * other.r
			this.r = sqrt(sum / PI)

			return true
		} else {
			return false
		}
	}
	this.constrain = function(){
		this.pos.x = constrain(this.pos.x, -arenaW + this.r, arenaW - this.r)
		this.pos.y = constrain(this.pos.y, -arenaH + this.r, arenaH - this.r)
	}
	this.show = function(){
		fill(this.c[0], this.c[1], this.c[2]);
		ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
	}
}
