var locale = require("locale");
var fontColor = g.theme.dark ? "#0f0" : "#000";
var paddingY = 2;
var font6x8At4Size = 32;
var font6x8At2Size = 18;
var heartRate = 0;


function setFontSize(pos){
  if(pos == 1)
    g.setFont("6x8", 4);
  else
    g.setFont("6x8", 2);
}

function clearField(pos){
  var yStartPos = Bangle.appRect.y + 
      paddingY * (pos - 1) + 
      font6x8At4Size * Math.min(1, pos-1) + 
      font6x8At2Size * Math.max(0, pos-2);
    var yEndPos = Bangle.appRect.y + 
      paddingY * (pos - 1) + 
      font6x8At4Size * Math.min(1, pos) + 
      font6x8At2Size * Math.max(0, pos-1);
    g.clearRect(Bangle.appRect.x, yStartPos, Bangle.appRect.x2, yEndPos);
}

function clearWatchIfNeeded(now){
  if(now.getMinutes() % 10 == 0)
    g.clearRect(Bangle.appRect.x, Bangle.appRect.y, Bangle.appRect.x2, Bangle.appRect.y2);
}

function drawLine(line, pos){
  setFontSize(pos);
  var yPos = Bangle.appRect.y + 
      paddingY * (pos - 1) + 
      font6x8At4Size * Math.min(1, pos-1) + 
      font6x8At2Size * Math.max(0, pos-2);
  g.drawString(line, 5, yPos, true);
}

function drawTime(now, pos){
  var h = now.getHours();
  var m = now.getMinutes();
  var time = ">" + (""+h).substr(-2) + ":" + ("0"+m).substr(-2);
  drawLine(time, pos);
}

function drawDate(now, pos){
  var dow = locale.dow(now, 1);
  var date = locale.date(now, 1).substr(0,6) + locale.date(now, 1).substr(-2);
  var locale_date = ">" + dow + " " + date;
  drawLine(locale_date, pos);
}

function drawInput(now, pos){
  clearField(pos);
  drawLine(">", pos);
}

function drawStepCount(pos){
  var health = Bangle.getHealthStatus("day");
  var steps_formated = ">Steps: " + health.steps;
  drawLine(steps_formated, pos);
}

function drawHRM(pos){
  clearField(pos);
  if(heartRate != 0)
    drawLine(">HR: " + parseInt(heartRate), pos);
  else
    drawLine(">HR: unknown", pos);
}

function drawActivity(pos){
  clearField(pos);
  var health = Bangle.getHealthStatus('last');
  var steps_formated = ">Motion: " + parseInt(health.movement);
  drawLine(steps_formated, pos);
}

function draw(){
  var curPos = 1;
  g.reset();
  g.setFontAlign(-1, -1);
  g.setColor(fontColor);
  var now = new Date();
  clearWatchIfNeeded(now); // mostly to not have issues when changing days
  drawTime(now, curPos);
  curPos++;
  if(settings.showDate){
    drawDate(now, curPos);
    curPos++;
  }
  if(settings.showHRM){
    drawHRM(curPos);
    curPos++;
  }
  if(settings.showActivity){
    drawActivity(curPos);
    curPos++;
  }
  if(settings.showStepCount){
    drawStepCount(curPos);
    curPos++;
  }
  drawInput(now, curPos);
}

Bangle.on('HRM',function(hrmInfo) {
  if(hrmInfo.confidence >= settings.HRMinConfidence)
    heartRate = hrmInfo.bpm;
});


// Clear the screen once, at startup
g.clear();
// load the settings
var settings = Object.assign({
  // default values
  HRMinConfidence: 50,
  showDate: true,
  showHRM: true,
  showActivity: true,
  showStepCount: true,
}, require('Storage').readJSON("terminalclock.json", true) || {});
// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
// draw immediately at first
draw();

var secondInterval = setInterval(draw, 10000);
