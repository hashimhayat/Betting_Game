
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
var COLORS = [];

// Instruction Text
var instructions;

// The Ring
var RING_RADIUS = 180;

// Betting Game Settings
var bettingGame = null;

// Ofsets
var offsetTop = 60;
var textInCentreVal = "+";

var GaussianValues = new Array(360);

function setup() {
  
  thecanvas = createCanvas(screenW,screenH);
  
  refreshBackground();
    
  colorwheel = select("#colorwheel");
  calibrateColorWheel();
  instructions = select('#instructions');
  //colorwheel.show();

}

function draw() {
  
  textInCentre(textInCentreVal);
  
  if (bettingGame && bettingGame.isStart){
    
    if (bettingGame.currentBets.length < bettingGame.trials){
      bettingGame.startTrial();
      bettingGame.showBets();
    } else {
      refreshBackground();
      bettingGame.trialEnded();
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
      
      var temp_colors = [];
      temp_colors = COLORS.slice();
      
      for (var b = 0; b < this.n_blobs; b++){
          var x = Math.cos((div * b) * (Math.PI / 180)) * this.radius;
          var y = Math.sin((div * b) * (Math.PI / 180)) * this.radius; 
          
          // Creating Blobs of random colors.

          var idx = int(random(0,temp_colors.length-1));
          var random_color = temp_colors[idx].split(',')
          
          var rr = int(random_color[0]);
          var rg = int(random_color[1]);
          var rb = int(random_color[2]);
          
          temp_colors.splice(idx,1);
          
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
    
  }
}

/*
  The Betting Game
  
  Attributes

  Functions
  
*/

function BettingGame(trials, num_blobs){
  
  
  this.init = function(){
    
      this.trials = trials;
      this.num_blobs = num_blobs;
      this.ring = null;
      
      // Settings
      this.isStart = false;
      this.timer = 0;
      this.timeup = false;
      this.timerActivated = false;
      
      // Current Session
      this.trialRunning = false;
      this.currentTrial = 0;
      this.currentBets = [];
      this.currentBlob = null;
      
      timer = 0;
    
    refreshBackground();
    this.ring = new Ring (window.innerWidth/2,window.innerHeight/2 + offsetTop, this.num_blobs, RING_RADIUS);
    this.ring.create();
    
  }
  
  this.startTrial = function(){    
    
    if (this.isStart){
      
      if (!this.timerActivated){
        window.setTimeout(timeup, duration*1000);
        this.timerActivated = true;
        refreshBackground();
        textInCentreVal = "+";
      }
      

      if (this.timeup){
        this.ring.hide();
        colorwheel.style('display', 'inline-block');
        showInstruction("Please place the first bet at the color you remember for this location.");
        this.getRandomBlob();

      } else {
        this.ring.show();
        colorwheel.style('display', 'none');
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

  this.showBets = function(){
    for (var b = 0; b < this.currentBets.length; b++){
      showBet(this.currentBets[b].angle);
    }
  }
  
  this.trialEnded = function(){
    // GameOver
    this.isStart = false;
    
    // Show correct answer
    
    // Save progress
    
    // Show a notice to start the next trial
    showInstruction("You earned 0 points. The number of points you earn per trial is proportional to the height of the stacked bets at the location of the correct answer. The faster you earn points, the quicker the experiment will end as it will finish after a fixed number is earned. Once the answer display has disappeared, press [ENTER] to start main experiment.");
    
  }
  
}

function Bet(angle){
  
  this.angle = angle;

  this.addBets = function(){

  }
}

function timeup(){
  console.log("timeup")
  bettingGame.timeup = true;
}

function keyPressed() {
  
  if (keyCode === ENTER) {
    bettingGame = new BettingGame(6, 6);
    bettingGame.init();
    bettingGame.isStart = true;
    
    instructions.hide();
    instructions.attribute("align", "center");
  } 
  
}

function showInstruction(_text){
	instructions.show();
	var pText = "<p>" + _text + "</p>"
  instructions.html(pText, false);
}

function textInCentre(_text){
  textSize(30)
  textAlign(CENTER);
  text(_text, width/2, height/2 + offsetTop);
}

function attachGaussian(acolor, angle){

  var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
  this.bettingGame.currentBets.push(new Bet(int(angle.replace('d',''))));

}

function displayGaussian(acolor, angle){
  
  var colors = acolor.replace("rgb(", "").replace(")","").split(',');
  this.bettingGame.currentBlob.c = {r: colors[0], g: colors[1], b: colors[2]}
  var angle = int(angle.replace('d',''))
  refreshBackground();
  showBet(angle, false)

}

function getGaussian(mean, standardDeviation, maxHeight,x) {
    return maxHeight * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
}

function showBet(angle, add){
  
  angleMode(DEGREES);
  
  push();  
    smooth();
    stroke(127, 63, 120,0.7);
    fill('white')
    translate(width/2, height/2 + offsetTop);
    rotate(angle);
    beginShape();

    for (var g = 40; g < 160; g++){
      
      // var idx = 0;
      // if (g < 100){
        
      //   idx = (angle - g);
        
      //   if (angle - g < 0){
      //     idx = 360 - (angle - g);
      //   }
        
      // } else {
        
      //   idx = (angle + g);
        
      //   if (angle + g > 360){
      //     idx = (angle + g) - 360;
      //   }
      // }
      
      // if (add){
      //   GaussianValues[idx] = getGaussian(100,20,50,g)
      //   console.log(GaussianValues)
      // }
    
      // var offset = 0;
      
      // if (GaussianValues[idx]){
      //   offset = GaussianValues[idx];
      // }

      vertex(getGaussian(100,20,50,g) + RING_RADIUS + 140, g - 100);
    
    }
    endShape(CLOSE);
  pop();
}

function refreshBackground(){
  background(81,174,213);
}

function calibrateColorWheel(){
  colorwheel.position(width/2 + 240,height/2 - 14 + offsetTop);
}

function windowResized() {
  screenW = window.innerWidth;  
  screenH = window.innerHeight;  
  thecanvas.size(screenW, screenH);
  calibrateColorWheel();
  refreshBackground();
}

function initGame(data) {
    var colorLines = data.split(/\r\n|\n/);

    for (var c = 0; c < colorLines.length; c++){
      var aColor = colorLines[c];
      COLORS.push(aColor);
      var pointer = document.createElement("span");
  		pointer.setAttribute("id", "d" + c)
  		pointer.style.backgroundColor = 'rgb(' + aColor + ')';
  		pointer.style.msTransform = "rotate(" + c + "deg)"
  		pointer.style.webkitTransform = "rotate(" + c + "deg)"
  		pointer.style.MozTransform = "rotate(" + c + "deg)"
  		pointer.style.OTransform = "rotate(" + c + "deg)"
  		pointer.style.transform = "rotate(" + c + "deg)"
  		pointer.onclick = function(){
  		  attachGaussian(this.style.backgroundColor, this.id);
  		}
      pointer.onmouseover = function(){
        displayGaussian(this.style.backgroundColor, this.id);
      }
  		document.getElementById('colorwheel').appendChild(pointer);
    }
    
    bettingGame = new BettingGame(6, 6);
    bettingGame.init();
}

