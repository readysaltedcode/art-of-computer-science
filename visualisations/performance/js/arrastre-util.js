"use strict";
var arrastre = arrastre || {};

arrastre.util = (function(){
  var my = {};

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

  return my;
}());