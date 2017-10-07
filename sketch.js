
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

// Timer Settings

var timer = 0;        // Current Time Keeper
var duration = 2;     // The duration for which the ring stays on the screen.
var timeup = false;

// Color Wheel Settings
var colorwheel;

// Instruction Text
var instructions;

// The Ring
var Ring;

var isStart = false;

function setup() {
  
  var thecanvas = createCanvas(screenW,screenH);
  
  background(81,174,213);
  
  Ring = new Ring (screenW/2,screenH/2,10,180);
  Ring.create();
  
  colorwheel = select("#colorwheel");
  calibrateColorWheel();
  instructions = select('#instructions');
}

function draw() {
  
  if (isStart && !timeup){
  
      timer = int(millis()/1000);
      
      if (timer == duration){
        timeup = true;
      }
      
      if (timeup){
        //Ring.hide();
        colorwheel.style('display', 'inline-block');
        showInstruction("Please place the first bet at the color you remember for this location.");
      } else {
        Ring.show();
      }
    
  }
  
  
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
  
  this.create = function(){
      
      var div = 360 / this.n_blobs;
      
      for (var b = 0; b < this.n_blobs; b++){
          var x = Math.cos((div * b) * (Math.PI / 180)) * this.radius;
          var y = Math.sin((div * b) * (Math.PI / 180)) * this.radius; 
          
          // Creating Blobs of random colors.
          var rr = int(random(0,255));
          var rg = int(random(0,255));
          var rb = int(random(0,255));
          
          var blob = new Blob(x + this.x,y + this.y, this.radius/3 ,{r:rr,g:rg,b:rb});
          this.blobs.push(blob);
          
      }
  }
  
  this.show = function(){
    for (var b = 0; b < this.n_blobs; b++){
      this.blobs[b].show();
    }
  }
  
  this.hide = function(){
    for (var b = 0; b < this.n_blobs; b++){
      this.blobs[b].hide();
    }
  }
  
}

function BettingGame(){
  this.ring = ring;
  
  
  
}

function calibrateColorWheel(){
  colorwheel.position(screenW/2 + 240,screenH/2 + 50);
}

function keyPressed() {
  if (keyCode === ENTER) {
    isStart = true;
    instructions.hide();
  }
}

function showInstruction(_text){
  instructions.show();
  instructions.html(_text, false);
}








