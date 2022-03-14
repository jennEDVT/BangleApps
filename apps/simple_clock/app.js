var Layout = require("Layout");
var count = 0;

var layout = new Layout( {
  type:"v", c: [
    {type:"txt", font:"10%", label:"", id:"padding1" },
    {type:"txt", font:"10%", label:"", id:"padding1a" },
    {type:"txt", font:"20%", label:"12:00", id:"time" },
    {type:"txt", font:"9%", label:"The Date", id:"date" },
    {type:"txt", font:"10%", label:"", id:"padding2" },
    {type:"txt", font:"8%", label:count , id:"btnResponse" },
    
        {type:"txt", font:"6x8:2", label:"", id:"padding3" },

    
     {type:"btn", font:"6x8:2", label:"Settings", cb: l=>openSettings() },
  ]
}, {btns:[
  {label:"", cb: l=>setLabel(),  cbl: l=>Bangle.showLauncher()},  
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
  Bangle.buzz(100,0.2);
  count = count + 1;
  layout.btnResponse.label = count;
  layout.render();
}

function openSettings() {
  Bangle.buzz(100,0.2);
  Bangle.showLauncher();
}

// update time and draw
g.clear();
draw();
Bangle.loadWidgets();
Bangle.drawWidgets();


