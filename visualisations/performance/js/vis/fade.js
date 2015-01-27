"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.fade = (function(){
  var my = {};

  var canvas = document.getElementById('mycanvas');
  var ctx = canvas.getContext('2d');

  my.render = function() {
    ctx.globalAlpha = 0.03;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, 1200, 800);
  }

  return my;
}());