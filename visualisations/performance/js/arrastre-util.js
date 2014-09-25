"use strict";
var arrastre = arrastre || {};

arrastre.util = (function(){
  var my = {};

  // my.getJointsOfSkeleton = function(json, skeleton) {
  //   var joints = [];
  //   if(json.Skeletons === undefined)
  //     return;
  //   if(skeleton > json.Skeletons.length - 1)
  //     return;
  //   _.each(json.Skeletons[skeleton].Joints, function(joint) {
  //     joints.push(joint);
  //   });
  //   return joints;
  // }

  my.getDataOfSkeleton = function(json, skeleton) {
    // Returns flat array of x, y & z positions
    var data = [];
    if(json.Skeletons === undefined)
      return;
    if(skeleton > json.Skeletons.length - 1)
      return;
    _.each(json.Skeletons[skeleton].Joints, function(joint) {
      var pos = joint.Position;
      data.push(pos.X);
      data.push(pos.Y);
      data.push(pos.Z);
    });
    return data;
  }

  my.getTrianglesOfSkeleton = function(json, skeleton) {
    // Return array of triangles of single skeleton

    // First construct lookup for joints
    var joints = {};
    _.each(json.Skeletons[skeleton].Joints, function(j) {
      joints[j.JointType] = j.Position;
    });

    var trianglePoints = [
      // ['ShoulderCenter', 'ShoulderLeft', 'ShoulderRight'],
      ['ShoulderLeft', 'ShoulderRight', 'Spine'],
      ['HipCenter', 'HipLeft', 'HipRight'],
      ['KneeLeft', 'AnkleLeft', 'FootLeft'],
      ['KneeRight', 'AnkleRight', 'FootRight'],
      ['HandLeft', 'WristLeft', 'ElbowLeft'],
      ['HandRight', 'WristRight', 'ElbowRight'],
      ['HipLeft', 'HipRight', 'KneeLeft'],
      ['HipLeft', 'HipRight', 'KneeRight'],
      ['ShoulderCenter', 'ShoulderLeft', 'ElbowLeft'],
      ['ShoulderCenter', 'ShoulderRight', 'ElbowRight']
    ];

    var triangles = _.map(trianglePoints, function(points) {
      var coords = _.map(points, function(p) {
        return joints[p];
      });
      return coords;
    });
    // console.log(triangles);
    return triangles;
  }

  // Drawing
  my.drawCircle = function(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  my.drawLine = function(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  my.drawBackground = function(ctx) {
    for(var i=0; i < 2; i++) {
      ctx.fillStyle = 'white';
      ctx.globalAlpha = Math.random();
      my.drawCircle(ctx, 1200 * Math.random(), 800 * Math.random(), 2 * Math.random());
    }
  }

  my.clearCanvas = function(ctx) {
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, 1200, 800);
  }

  return my;
}());