"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.debugging4 = (function(){
  var my = {};

  var width = 1200, height = 800;

  var color = d3.scale.category20();
  var xScale = d3.scale.linear().domain([-1.5, 1.5]).range([0, width]);
  var yScale = d3.scale.linear().domain([-1.5, 1.5]).range([height, 0]);

  var ctx = arrastre.canvas.ctx;

  my.render = function() {

    var frame = arrastre.frameManager.currentFrame;
    if(!frame) return;

    var triangles = arrastre.util.getTrianglesOfSkeleton(frame, 0);

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.4;

    _.each(triangles, function(triangle, index) {
      ctx.fillStyle = color(index);
      ctx.beginPath();
      _.each(triangle, function(vertex) {
        var x = xScale(vertex.X);
        var y = yScale(vertex.Y);
        ctx.lineTo(x, y);
      });
      ctx.fill();
    });

    // Draw head
    _.each(frame.Skeletons[0].Joints, function(j) {
      if(j.JointType !== 'Head')
        return;

      ctx.fillStyle = color(15);
      var x = xScale(j.Position.X);
      var y = yScale(j.Position.Y);
      arrastre.canvas.drawCircle(x, y, 18);
    });
  }

  return my;

}());