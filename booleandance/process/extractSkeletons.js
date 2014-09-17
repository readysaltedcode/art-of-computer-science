// Output array of monthly stats, by directory 
var _ = require('underscore');
var d3 = require('d3');
var fs = require('fs');


function precision(v) {
	return +(new Number(v).toPrecision(4));
}

fs.readFile('../data/nerddance.json', 'utf8', function(err, json) {

	var data = JSON.parse(json);

	// console.log(JSON.parse(json));

	var out = [];

	var startTs = 689000, endTs = 756324;
	var jointTypes = ['HipCenter', /*'Spine',*/ 'ShoulderLeft', 'ElbowLeft', 'HandLeft', 'ShoulderRight', 'ElbowRight', 'HandRight', 'KneeLeft', 'FootLeft', 'KneeRight', 'FootRight', 'Head'];

	_.each(data, function(frame) {
		if(frame.Skeletons.length < 1)
			return;

		if(frame.TimeStamp < startTs || frame.TimeStamp > endTs)
			return;

		var ret = {};
		ret.ts = frame.TimeStamp;

		// Assume one skeleton
		var skeleton = frame.Skeletons[0];

		var joints = skeleton.Joints;
		joints = _.filter(joints, function(d) {
			return _.indexOf(jointTypes, d.JointType) > -1;
		});

		ret.joints = _.map(joints, function(joint) {
			var pos = joint.Position;
			pos = {x: precision(pos.X), y: precision(pos.Y)};

			// var jointType = _.filter(joint.JointType, function(s) {
			// 	return s>='A' && s<='Z';
			// }).join('');
			return {/*joint: jointType,*/ pos: pos};
		});



		out.push(ret);
	});

	// Filter out half the data (compression)
	out = _.filter(out, function(d, i) {
		return i % 4 === 0;
	});
	// console.log(out);

	fs.writeFile('../data/skeletons.json', JSON.stringify(out, null, false));

});
