"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.computational = (function(){
  var my = {};

  var xScale = d3.scale.linear().domain([-0.8, 0.5]).range([0, 1000]);
  var yScale = d3.scale.linear().domain([-0.2, 1]).range([1000, 0]);

  var ctx = arrastre.canvas.ctx;

  var colors = {
    HipCenter : '#ff7f0e',
    Spine : '#ff7f0e',
    ShoulderCenter : '#ff7f0e',
    Head : '#e7cb94',
    ShoulderLeft : '#bd9e39',
    ElbowLeft : '#bd9e39',
    WristLeft : '#bd9e39',
    HandLeft : '#e7cb94',
    ShoulderRight : '#bd9e39',
    ElbowRight : '#bd9e39',
    WristRight : '#bd9e39',
    HandRight : '#e7cb94',
    HipLeft : '#bd9e39',
    KneeLeft : '#bd9e39',
    AnkleLeft : '#bd9e39',
    FootLeft : '#e7cb94',
    HipRight : '#bd9e39',
    KneeRight : '#bd9e39',
    AnkleRight : '#bd9e39',
    FootRight : '#e7cb94'
  }

  my.render = function() {
    ctx.globalAlpha = 0.15;

    var frame = arrastre.frameManager.currentFrame;
    if(!frame)
      return;

    _.each(frame.Skeletons[0].Joints, function(joint, i) {
      ctx.fillStyle = colors[joint.JointType];
      arrastre.canvas.drawCircle(xScale(joint.Position.X), yScale(joint.Position.Y), 3);
    });
  }

  return my;
}());