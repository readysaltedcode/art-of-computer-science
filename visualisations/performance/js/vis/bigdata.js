"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.bigdata = (function(){
  var my = {};

  var width = 1200, height = 800;

  var startTime = Date.now();

  var color = d3.scale.category20b();
  var scale = d3.scale.linear().domain([-3, 6]).range([1000, 0]);
  var indexScale = d3.scale.threshold().domain([0, 53000, 70000, 84000, 120000, 153000, 167000, 200000, 230000]).range([0, 0, 4, 40, 10, 1, 60, 20, 10, 0]);

  var canvas = document.getElementById('mycanvas');
  var ctx = canvas.getContext('2d');



  my.render = function() {

      var frame = arrastre.frameManager.currentFrame;

      if(!frame)
        return;

      var data = getDataOfSkeleton(frame, 0);
      // console.log(data);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, width, height);
 
      // var indexThreshold = indexScale(Date.now() - startTime);
      var ts = arrastre.frameManager.ts;
      var indexThreshold = indexScale(ts);
      d3.select('#info').text(ts + ': ' + indexThreshold);

      _.each(data, function(d, index) {
        if(index > indexThreshold)
          return;

        // console.log(d);

        var x = Math.random() * width;
        var y = scale(d) % height;

        var c = color(index % 10);

        ctx.shadowColor = c;
        ctx.shadowBlur = 10;

        ctx.fillStyle = c;
        drawCircle(ctx, x, y, 3);

        ctx.save();
        // ctx.translate(-600, -600);
        // ctx.scale(4, 4);
        ctx.globalAlpha = 0.02;
        if(Math.random() > 0.9)
          drawCircle(ctx, x, y, 100 + Math.random() * 100);
        ctx.restore();

      });
  }

  return my;
}());

