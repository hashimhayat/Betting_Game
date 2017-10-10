
// Reading Colors from CSV

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "wheel/colors.txt",
        dataType: "text",
        success: function(data) {processData(data);}
    });
});

function processData(data) {
    var colorLines = data.split(/\r\n|\n/);
    var lines = [];
    
    for (var c = 0; c < colorLines.length; c++){
      var aColor = colorLines[c];
      var pointer = document.createElement("span");
  		pointer.setAttribute("id", "d" + c)
  		pointer.style.backgroundColor = 'rgb(' + aColor + ')';
  		pointer.style.msTransform = "rotate(" + c + "deg)"
  		pointer.style.webkitTransform = "rotate(" + c + "deg)"
  		pointer.style.MozTransform = "rotate(" + c + "deg)"
  		pointer.style.OTransform = "rotate(" + c + "deg)"
  		pointer.style.transform = "rotate(" + c + "deg)"
  		pointer.onclick = function(){
  		  placeBet(this.style.backgroundColor);
  		}
      pointer.onmouseover = function(){
        getColor_Angel(this.style.backgroundColor, this.id);
      }
  		document.getElementById('colorwheel').appendChild(pointer);
    }
}


