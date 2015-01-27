"use strict";
var arrastre = arrastre || {};

arrastre.canvas = (function(){
  var my = {};

  my.width = 1200;
  my.height = 800;

  var canvas = document.getElementById('mycanvas');
  my.ctx = canvas.getContext('2d');

  my.ctx.fillStyle = "rgb(0,0,0)";
  my.ctx.fillRect(0, 0, my.width, my.height);

  my.drawCircle = function(x, y, r) {
    my.ctx.beginPath();
    my.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    my.ctx.fill();
  }

  my.drawLine = function(x0, y0, x1, y1) {
    my.ctx.beginPath();
    my.ctx.moveTo(x0, y0);
    my.ctx.lineTo(x1, y1);
    my.ctx.stroke();
  }

  my.drawBackground = function() {
    for(var i=0; i < 2; i++) {
      my.ctx.fillStyle = 'white';
      my.ctx.globalAlpha = Math.random();
      my.drawCircle(1200 * Math.random(), 800 * Math.random(), 2 * Math.random());
    }
  }

  my.clearCanvas = function() {
    my.ctx.globalAlpha = 1;
    my.ctx.shadowBlur = 0;
    my.ctx.fillStyle = "rgb(0, 0, 0)";
    my.ctx.fillRect(0, 0, 1200, 800);
  }

  return my;
}());