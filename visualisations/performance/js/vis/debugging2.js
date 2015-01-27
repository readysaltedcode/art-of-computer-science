"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.debugging2 = (function(){
  var my = {};

  var width = 1200, height = 800;

  var color = d3.scale.category20();
  var xScale = d3.scale.linear().domain([-0.9, 0.9]).range([0, width]);
  var yScale = d3.scale.linear().domain([-0.6, 1.2]).range([height, 0]);

  var ctx = arrastre.canvas.ctx;

  my.render = function() {

    var frame = arrastre.frameManager.currentFrame;
    if(!frame) return;

    var triangles = arrastre.util.getTrianglesOfSkeleton(frame, 0);

      ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.03;

      ctx.beginPath();
      ctx.fillStyle = '#aec7e8';
      _.each(triangles, function(triangle, index) {
        _.each(triangle, function(vertex) {
          var x = xScale(vertex.X);
          var y = yScale(vertex.Y);
          ctx.lineTo(x, y);
        });
      });
 
      // Draw head
      _.each(frame.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;
        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        ctx.lineTo(x,y);
      });

      ctx.fill();
    }

  return my;

}());