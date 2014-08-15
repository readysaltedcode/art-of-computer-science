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

