"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.boolean = (function(){
  var my = {};

  var width = 1200, height = 800;

  var color = d3.scale.linear().domain([-1, 0]).range(['white', 'blue']);
  var scale = d3.scale.linear().domain([-3, 3]).range([0, 255]);

  var chanceOfBinary = d3.scale.linear().domain([0, 135000, 220000, 221000, 300000]).range([0, 0, 0.6, 0, 0]).clamp(true);
  var numCirclesScale = d3.scale.linear().domain([0, 135000, 220000, 221000, 300000]).range([0, 0, 4, 0, 0]).clamp(true);

  var ctx = arrastre.canvas.ctx;

  my.render = function() {

    var frame = arrastre.frameManager.currentFrame;
    if(!frame)
      return;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    var ts = arrastre.frameManager.ts;
    var threshold = numCirclesScale(ts);
    var data = arrastre.util.getDataOfSkeleton(frame, 0);

    _.each(data, function(d, index) {
      if(index > threshold)
        return;

      var drawAsBinary = Math.random() < chanceOfBinary(ts);
      if(drawAsBinary) {
        var fontSize = 16;
        ctx.font = 'bold ' + fontSize + 'px sans-serif';

        var binary = Math.round(scale(d)).toString(2);
        _.each(binary, function(bit) {
          var x = Math.random() * width;
          var y = Math.random() * height;
          ctx.fillStyle = bit === '1' ? 'blue' : '#888';

          ctx.fillText(bit, x, y);

          if(bit === '1') {
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 30;
            ctx.globalAlpha = 0.1;
            arrastre.canvas.drawCircle(x, y, 100 * Math.random());
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }

        });
      } else {
        var x = Math.random() * width;
        var y = Math.random() * height;

        ctx.fillStyle = color(d);
        arrastre.canvas.drawCircle(x, y, 3);
      }
    });
  }

  return my;
}());
