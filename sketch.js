
/*
  The Betting Game
  Fougie Lab
  
  Purpose: The betting game is a task designed to give us information about the visual short-term memories 
           for different stimulus features (e.g., color, orientation) and the degree and type of uncertainty 
           with which they are stored. For this prototype, we will be focusing on color memory. 
           
           Each experiment using this task/paradigm consists of a large number of trials. In each trial the 
           observer is initially presented with a ring of colored dots/blobs (filled in circles), followed 
           by a blank screen during which they are required to remember the colors, followed by a response 
           screen in which a color wheel is presented and the participant can click on locations around the 
           color wheel to indicate where their memory of the color lies in color space.
  
  Stimuli (Blobs): The color of each blob is selected at random from a matrix containing 360 RGB values, which 
           varies continuously through the colors red-purple-blue-green-orange-red so that it can be represented 
           as a color wheel at the end of each trial. The blobs are presented on the screen for 1000msec (1 second). 
           The number of the blobs can be varied by a variable in the program, but the space between in each blob in 
           degrees should be an equal fraction of the total number of degrees in a circle (360). So, for example, when 
           six blobs are present, each blob should be 60 degrees from each neighboring blob. The radius of all blobs 
           is the same and should be able to be set using a variable in the program. The distance from the center of 
           the screen to each blob is the same and should also be set by a variable.
*/

var screenW = window.innerWidth;    // Screen Width
var screenH = window.innerHeight;   // Screen Height
var thecanvas;

// Timer Settings

var timer;            // Current Time Keeper
var duration = 3;     // The duration for which the ring stays on the screen.

// Color Wheel Settings
var colorwheel;

// Instruction Text
var instructions;

// The Ring
var RING_RADIUS = 180;

// Betting Game Settings
var bettingGame;

function setup() {
  
  thecanvas = createCanvas(screenW,screenH);
  
  refreshBackground();
    
  colorwheel = select("#colorwheel");
  calibrateColorWheel();
  instructions = select('#instructions');
  colorwheel.show();

  bettingGame = new BettingGame(50, 5);
  // bettingGame.init();
  
  


}

function draw() {
  
  //refreshBackground();
  

  
  // if (bettingGame.currentTrial < bettingGame.trials){
  //   bettingGame.startTrial();
  // }
}

/*
    The Blob Object.
    
    Attributes
    x : x position on screen
    y : y position on screen
    r : radius of the blob
    c : color of the blob {r,g,b}
    
    Functions
    show : displays the blob
    hide : hides the blob
*/

function Blob(x,y,r,c){
  
  this.x = x;
  this.y = y;
  this.r = r;
  this.c = c;
  this.display = true;

  this.show = function(){
    
    if (this.display){
      noStroke();
      fill(this.c.r,this.c.g,this.c.b);
      ellipse(this.x,this.y,this.r, this.r);
    }
  } 
  
  this.hide = function(){
    this.display = false;
  }

  this.unhide = function(){
    this.display = true;
  }

  this.resetColor = function(){
      noStroke();
      fill('white');
      ellipse(this.x,this.y,this.r, this.r);
  }

}

/*
  The Ring of Blobs.
  
  Attributed
  x : x position on screen
  y : y position on screen
  n : Number of Blobs
  r : radius of the Ring
  
  Functions
  create : creates the Ring
  show : shows the Ring
  hide: hides the Ring
*/

function Ring (x,y,n,r){
  
  this.x = x;
  this.y = y;
  this.n_blobs = n;
  this.radius = r;
  this.blobs = [];
  this.display = false;
  
  this.create = function(){
      
      var div = 360 / this.n_blobs;
      
      for (var b = 0; b < this.n_blobs; b++){
          var x = Math.cos((div * b) * (Math.PI / 180)) * this.radius;
          var y = Math.sin((div * b) * (Math.PI / 180)) * this.radius; 
          
          // Creating Blobs of random colors.
          var rr = int(random(0,255));
          var rg = int(random(0,255));
          var rb = int(random(0,255));
          
          var blob = new Blob(x + this.x, y + this.y, this.radius/2 ,{r:rr,g:rg,b:rb});
          this.blobs.push(blob);
          
      }

      this.display = true;
  }
  
  this.show = function(){

    if (this.display){
      for (var b = 0; b < this.n_blobs; b++){
        this.blobs[b].show();
      }  
    }
  }
  
  this.hide = function(){

    if (this.display){
      for (var b = 0; b < this.n_blobs; b++){
        this.blobs[b].hide();
      }
      refreshBackground();
    }

    this.display = false;
  }

  this.calibrate = function(){
      for (var b = 0; b < this.n_blobs; b++){
        this.blobs[b]
      }
  }
  
}

/*
  The Betting Game
  
  Attributes
  
  
  
  Functions
  
*/

function BettingGame(trials, num_blobs){
  
  this.trials = trials;
  this.num_blobs = num_blobs;
  this.ring = null;
  
  // Settings
  this.isStart = false;
  this.timer = 0;
  this.timeup = false;
  
  // Current Session
  this.trialRunning = false;
  this.currentTrial = 0;
  this.currentBets = [];
  this.currentBlob = null;
  
  this.init = function(){
    this.ring = new Ring (screenW/2,screenH/2, this.num_blobs, RING_RADIUS);
    this.ring.create();
  }
  
  this.startTrial = function(){    
    
    if (this.isStart){

      timer = window.setTimeout(timeup, duration*1000);
      
    if (this.timeup){

      this.ring.hide();
      colorwheel.style('display', 'inline-block');
      showInstruction("Please place the first bet at the color you remember for this location.");
      this.getRandomBlob();

    } else {
      this.ring.show();
    }

    }
  }

  this.timeisup = function(){
    this.timeup = true;
  }
  
  this.getRandomBlob = function(){
    if (this.currentBlob == null){
      this.currentBlob = this.ring.blobs[int(random(0, this.ring.blobs.length))];
      this.currentBlob.unhide();
      this.currentBlob.resetColor();
    }
    this.currentBlob.show();
  }
  
  this.getBets = function(){
    
    if (this.currentBets.length < 6){
      
    } else {
      this.currentTrial += 1;
    }
  }
  
}

function Gaussian(){

  this.getGaussian = function(){

  }
}

function timeup(){
  bettingGame.timeup = true;
  window.clearTimeout(timer);
}

function calibrateColorWheel(){
  colorwheel.position(screenW/2 + 240,screenH/2 + 50);
}

function keyPressed() {
  if (keyCode === ENTER) {
    bettingGame.isStart = true;
    instructions.hide();
  }
}

function showInstruction(_text){
	instructions.show();
  instructions.html(_text, false);
}

function placeBet(acolor){
  var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
}

function getColor(acolor){

  var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
}

function getColor_Angel(acolor, angle){
  var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  //this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
  
  angle = int(angle.replace("d",""));
  
	angleMode(DEGREES);
  var a = atan2(mouseY-height/2, mouseX-width/2);
	console.log(a);
  refreshBackground();
  
  stroke(127, 63, 120,0.7);
  translate(width/2, (height+5)/2);
  rotate(a + 5);
  beginShape();
  
  for (var g = 0; g < 200; g++){
      vertex(getGaussian(100,20,50,g) + RING_RADIUS + 140, g - 110);
  }

  endShape(CLOSE);
  
}

function refreshBackground(){
  background(81,174,213);
}

function windowResized() {
  screenW = window.innerWidth;  
  screenH = window.innerHeight;  
  thecanvas.size(screenW, screenH);
  refreshBackground();
}

function getGaussian(mean, standardDeviation, maxHeight,x) {
    return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
}