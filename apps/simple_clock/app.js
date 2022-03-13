var Layout = require("Layout");
var count = 0;

var layout = new Layout( {
  type:"v", c: [
    {type:"txt", font:"25%", label:"12:00", id:"time" },
    {type:"txt", font:"9%", label:"The Date", id:"date" },
    {type:"txt", font:"12%", label:"", id:"padding1" },
    {type:"txt", font:"8%", label:count , id:"btnResponse" }
  ]
}, {btns:[
  {label:"c", cb: l=>setLabel(),  cbl: l=>Bangle.showLauncher()},  
], lazy:true});

// timeout used to update every minute
var drawTimeout;

// update the screen
function draw() {
  var d = new Date();
  // update time and date
  layout.time.label = require("locale").time(d,1);
  layout.date.label = require("locale").date(d);
  layout.render();
  // schedule a draw for the next minute
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}


function setLabel() {
  Bangle.buzz(300,0.8);
  count = count + 1;
  layout.btnResponse.label = count;
  layout.render();
}

// update time and draw
g.clear();
draw();



