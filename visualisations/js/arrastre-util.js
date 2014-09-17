function getJointsOfSkeleton(json, skeleton) {
  var joints = [];
  if(json.Skeletons === undefined)
    return;
  if(skeleton > json.Skeletons.length - 1)
    return;
  _.each(json.Skeletons[skeleton].Joints, function(joint) {
    joints.push(joint);
  });
  return joints;
}

function getDataOfSkeleton(json, skeleton) {
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

function getTrianglesOfSkeleton(json, skeleton) {
  // Return array of triangles of single skeleton

  // console.log(json);

  // First construct lookup for joints
  var joints = {};
  _.each(json.Skeletons[skeleton].Joints, function(j) {
    joints[j.JointType] = j.Position;
  });

  // console.log(joints);

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
function drawCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.fill();
}

function drawLine(ctx, x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}