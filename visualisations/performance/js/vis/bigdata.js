"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.bigdata = (function(){
  var my = {};

  var width = 1200, height = 800;

  var startTime = Date.now();

  var color = d3.scale.category20b();
  var scale = d3.scale.linear().domain([-2, 2]).range([height, 0]);
  var indexScale = d3.scale.threshold().domain([0, 52000, 69000, 83000, 119000, 152000, 165000, 200000, 230000]).range([0, 0, 4, 40, 10, 1, 60, 20, 10, 0]);

  var ctx = arrastre.canvas.ctx;

  my.render = function() {

      var frame = arrastre.frameManager.currentFrame;
      if(!frame)
        return;

      var data = arrastre.util.getDataOfSkeleton(frame, 0);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, width, height);
 
      var ts = arrastre.frameManager.ts;
      var indexThreshold = indexScale(ts);

      _.each(data, function(d, index) {
        if(index > indexThreshold)
          return;

        var x = Math.random() * width;
        var y = scale(d) % height;
        var c = color(index % 10);

        ctx.shadowColor = c;
        ctx.shadowBlur = 10;

        ctx.fillStyle = c;
        arrastre.canvas.drawCircle(x, y, 3);

        ctx.save();
        ctx.globalAlpha = 0.02;
        if(Math.random() > 0.9)
          arrastre.canvas.drawCircle(x, y, 100 + Math.random() * 100);
        ctx.restore();
      });
  }

  return my;
}());

