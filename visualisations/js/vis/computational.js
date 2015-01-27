
// BIGDATA
// For a single skeleton, each joint position is represented with 3 points (one for each co-ordinate). Each joint has a unique colour.
// The value of each co-ordinate is mapped to the y-axis. The x-axis is random.

function Computational(canvas) {
  var xScale = d3.scale.linear().domain([-1, 1]).range([0, 1000]);
  var yScale = d3.scale.linear().domain([-0.2, 1.2]).range([1000, 0]);

  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, 1000, 800);
  
  // 3 colours, one for extremities, another for insides, another for in-betweens
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

  // Colour coded hands + feet
  // var colors = {
  //   HipCenter : '#5254a3',
  //   Spine : '#5254a3',
  //   ShoulderCenter : '#5254a3',
  //   Head : '#5254a3',
  //   ShoulderLeft : '#5254a3',
  //   ElbowLeft : '#5254a3',
  //   WristLeft : '#5254a3',
  //   HandLeft : '#637939',
  //   ShoulderRight : '#5254a3',
  //   ElbowRight : '#5254a3',
  //   WristRight : '#5254a3',
  //   HandRight : '#8c6d31',
  //   HipLeft : '#5254a3',
  //   KneeLeft : '#5254a3',
  //   AnkleLeft : '#5254a3',
  //   FootLeft : '#843c39',
  //   HipRight : '#5254a3',
  //   KneeRight : '#5254a3',
  //   AnkleRight : '#5254a3',
  //   FootRight : '#7b4173'
  // }

  function getAllJoints(json) {
    var joints = [];
    _.each(json.Skeletons, function(skeleton) {
      _.each(skeleton.Joints, function(joint) {
        joints.push(joint);
      });
    });
    return joints;
  }

  function getJointsOfSkeleton(json, skeleton) {
    var joints = [];
    if(json.Skeletons === undefined)
      return [];
    if(skeleton > json.Skeletons.length - 1)
      return [];
    _.each(json.Skeletons[skeleton].Joints, function(joint) {
      joints.push(joint);
    });
    return joints;
  }

  function clear() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, 1000, 800);
  }

  // poll()
  this.poll = function() {
    var me = this;
    d3.json('/playbackServer/api/data.json', function(err,json){me.draw(err,json);});
  };
  
  this.draw = function(err, json) {
    if(json === undefined) return;
    d3.json('/playbackServer/api/data.json', function(err, json) {
      // console.log(json);
      if(json === undefined) {
        return;
      }

      var joints = getJointsOfSkeleton(json, 0);
      ctx.globalAlpha = 0.03;

      _.each(joints, function(joint, i) {
        // console.log(joint.JointType)
        ctx.fillStyle = colors[joint.JointType];
        drawCircle(ctx, xScale(joint.Position.X), yScale(joint.Position.Y), 3);
      });
    });
  };
};