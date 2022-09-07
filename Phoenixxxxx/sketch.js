var blackHoleNum;
var R = 25;
var particles = [];
var particleNum;
var h;
var h2;
var s;
var b;
let endFlag = true;
var head = [];
var headNum;
var wing = [];
var wingNum;
var thetaHR;
var thetaLR;
var maxlifeR;

var starModeFlag;
var sauModeFlag;

function setup(){
    createCanvas(640,640);
    background(20);
    frameRate(120);

    if (random(1) < 0.9) {
        starModeFlag = true;
    }
    if (random(1) < 0.5) {
        sauModeFlag = true;
    }

    thetaHR = random(8,8.5);
    thetaLR = random(6.5,7);
    maxlifeR =random(4,10);

    wingNum = map(maxlifeR,4,10,100,300);
    particleNum = map(maxlifeR,4,10,600,300);
    headNum = map(maxlifeR,4,10,20,50);

    h = random(180,420);
    h2 = random(180,420);
    if (h2 < 260 && h < 260) {
        sauModeFlag = true;
    }


    s = random(80,100);
    b = 100;
    colorMode(HSB,360,100,100);

    for(let i = 0;i < particleNum;i++){
        particles[i] = new Particle(width/2,height/2,random(map(maxlifeR,10,4,0.0012,0.003),map(maxlifeR,10,4,0.0055,0.004)));
    }

    for(let i = 0;i < headNum;i++){
        head[i] = new Head(width/2,height/2,map(maxlifeR,4,10,0.0055,0.006));
    }

    for(let i = 0;i < wingNum;i++){
        wing[i] = new Wing(width/2,height/2,random(0.0035,0.004));
    }
}

function draw(){
    for (var i = 0; i < head.length; i++) {
        head[i].move();
        head[i].display();
    }

    for(let i = 0;i < wing.length;i++){
        wing[i].move();
        wing[i].display();
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].move();
        particles[i].display();
    }
}

class Particle {
    constructor(tempX,tempY,tempA) {
        this.x = tempX;
        this.y = tempY;

        this.s = 0;
        this.size = 1;
        this.theta = 1;
        this.life = 0;
        this.addition = tempA;
        this.maxlife = maxlifeR;
        this.dead = false;

        this.starMode = starModeFlag;
        this.sauMode = sauModeFlag;
    }

    move(){
        if (! this.dead) {
            let x = cos(this.theta);
            let y = sin(this.theta);

            this.x += x*this.s+randomGaussian(0,0.1)*this.life;
            this.y += y*this.s+randomGaussian(0,0.1)*this.life;

            this.theta += 0.01;
            this.s += 0.001*this.life;
            this.life += this.addition;
            if (this.life >= this.maxlife) {
                this.dead = true;
            }
        }
    }

    display(){
        let ph = map(this.maxlife-this.life,0,this.maxlife,h,h2);
        if (ph > 360) {
            ph -= 360;
        }
        if (this.starMode) {
            if (random(1)<0.5) {

                fill(ph,map(this.maxlife-this.life,0,this.maxlife,100,0),b,map(this.maxlife-this.life,0,this.maxlife,1,0));
            }else {
                fill(ph,s,b,map(this.maxlife-this.life,0,this.maxlife,1,0));
            }
        }else {
            if (this.sauMode) {
                fill(ph,map(this.maxlife-this.life,0,this.maxlife,100,0),b,map(this.maxlife-this.life,0,this.maxlife,1,0));
            }else {
                fill(ph,s,b,map(this.maxlife-this.life,0,this.maxlife,1,0));
            }
        }


        noStroke();
        ellipse(this.x,this.y,this.size,this.size);
    }

}

class Head extends Particle{
    constructor(tempX,tempY,tempA){
        super(tempX,tempY,tempA);
        this.changeLife =constrain(randomGaussian(0.8,0.2),0.8,2.0);
        this.thetaH = random(3.8,5);
    }

    move(){
        if (this.theta >= this.thetaH && this.changeLife> 0) {
            let x = -cos(this.theta);
            let y = sin(this.theta);
            this.x += x*this.s+randomGaussian(0,0.1)*this.changeLife;
            this.y += y*this.s+randomGaussian(0,0.1)*this.changeLife;

            this.theta += 0.01;
            this.s += 0.001*this.life;
            this.life += this.addition;
            this.changeLife -= 0.01;
        }else if (this.theta < this.thetaH) {
            let x = cos(this.theta);
            let y = sin(this.theta);
            this.x += x*this.s+randomGaussian(0,0.1)*this.life;
            this.y += y*this.s+randomGaussian(0,0.1)*this.life;

            this.theta += 0.01;
            this.s += 0.001*this.life;
            this.life += this.addition;
        }
    }
}

class Wing extends Particle{
    constructor(tempX,tempY,tempA){
        super(tempX,tempY,tempA);

        this.thetaH = random(thetaLR,thetaHR);

        this.changeLife = randomGaussian(0.6,0.2);
        this.thetaD = 0;
    }

    move(){
        if (this.theta >= this.thetaH && this.changeLife> 0) {
            let x = cos(this.thetaD);
            let y = sin(this.thetaD);
            this.x += x*this.s;
            this.y += y*this.s;
            this.thetaD -= 0.02;
            this.s += 0.01*this.life;
            this.life += this.addition;
            this.changeLife -= 0.01;
        }else if (this.theta < this.thetaH) {
            let x = cos(this.theta);
            let y = sin(this.theta);
            this.x += x*this.s+randomGaussian(0,0.1)*this.life;
            this.y += y*this.s+randomGaussian(0,0.1)*this.life;
            this.theta += 0.01;
            this.s += 0.001*this.life;
            this.life += this.addition;
            this.thetaD = this.theta;
        }
    }
}

function keyPressed() {
    if (key == 's'){
        saveCanvas('myCanvas', 'jpg');
    }
}
