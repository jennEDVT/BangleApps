var Layout = require("Layout");
var count = 0;
var count2 = 0;

var layout = new Layout( {
  type:"v", c: [
    {type:"txt", font:"10%", label:"", id:"padding1" },
    {type:"txt", font:"10%", label:"", id:"padding1a" },
    {type:"txt", font:"20%", label:"12:00", id:"time" },
    {type:"txt", font:"9%", label:"The Date", id:"date" },
    {type:"txt", font:"10%", label:"", id:"padding2" },
    {type:"h", c: [
       {type:"txt", font:"8%", label:count , id:"btnResponse" },
       {type:"txt", font:"10%", label:"    ", id:"padding5" },
       {type:"txt", font:"8%", label:count , id:"btn2Response" },
    ]},    
    {type:"txt", font:"3%", label:"", id:"padding3" },
    {type:"h", c: [
      {type:"btn", pad:8, font:"6x8:2", label:"Set", cb: l=>openSettings() },
      {type:"btn",  pad:8, font:"6x8:2", fillx: 1, label:"Count", cb: l=>setLabel2() },
    ]}    
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
  layout.clear(layout.btnResponse.label);
  layout.render();
}

function setLabel2() {
  Bangle.buzz(100,0.2);
  count2 = count2 + 1;
  layout.btn2Response.label = count2;
  layout.clear(layout.btn2Response.label);
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


