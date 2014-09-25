"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.algorithms = (function(){
  var my = {};

  var xScale = d3.scale.linear().domain([-0.3, 1.7]).range([0, 800]);
  var yScale = d3.scale.linear().domain([-1.5, 0.5]).range([800, 0]);

  var radiusScale = d3.scale.linear().domain([5, 0]).range([8, 30]);
  var colorScale = d3.scale.linear().domain([0, 5]).range(['brown', 'yellow']);

  var interpolationScale = d3.scale.linear().domain([0, 32000, 156000, 200000, 330000]).range([0, 0, 0.1, 1, 1]).clamp(true);
  var depthScale = d3.scale.linear().domain([0, 16000, 20000, 32000, 46000, 62000, 77000]).range([-1, 0, 1, 2, 3, 4, 5]).clamp(true);
  var alphaScale = d3.scale.linear().domain([0, 330000]).range([0.01, 0.2]).clamp(true);
  var linkAlphaScale = d3.scale.linear().domain([0, 330000]).range([0, 1]).clamp(true);

  var ctx = arrastre.canvas.ctx;

  var treeNodes, treeLinks;
  var depth = 0;

  var tree = {
    name: 'Spine',
    children: [
      {
        name: 'HipCenter',
        children: [
          {
            name: 'HipLeft',
            children: [
              {
                name: 'KneeLeft',
                children: [
                  {
                    name: 'AnkleLeft',
                    children: [
                      {
                        name: 'FootLeft'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'HipRight',
            children: [
              {
                name: 'KneeRight',
                children: [
                  {
                    name: 'AnkleRight',
                    children: [
                      {
                        name: 'FootRight'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'ShoulderCenter',
        children: [
          {
            name: 'Head'
          },
          {
            name: 'ShoulderLeft',
            children: [
              {
                name: 'ElbowLeft',
                children: [
                  {
                    name: 'WristLeft',
                    children: [
                      {
                        name: 'HandLeft'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: 'ShoulderRight',
            children: [
              {
                name: 'ElbowRight',
                children: [
                  {
                    name: 'WristRight',
                    children: [
                      {
                        name: 'HandRight'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };


  function getJointsOfSkeleton(json, skeleton) {
    // Transform Kinect data into object
    var joints = {};
    if(json.Skeletons === undefined)
      return;
    if(skeleton > json.Skeletons.length - 1)
      return;
    _.each(json.Skeletons[skeleton].Joints, function(joint) {
      joints[joint.JointType] = joint;
    });
    return joints;
  }


  function initialiseTree() {
    var treeLayout = d3.layout.tree()
      .size([0.6 * Math.PI, 500]);

      // console.log(tree);
    var treeNodesArray = treeLayout(tree);

    var treeLinksArray = treeLayout.links(treeNodesArray);

    // keep tabs on original positions
    treeNodesArray = _.map(treeNodesArray, function(node) {
      node.startX = node.y * Math.sin(node.x - 0.3 * Math.PI);
      node.startY = -(node.y * Math.cos(node.x - 0.3 * Math.PI) - 450);
      return node;
    });

    // convert to object
    treeNodes = {};
    _.each(treeNodesArray, function(node) {
      treeNodes[node.name] = node;
    })

    treeLinks = treeLinksArray;
  }

  function drawAdditionalBackground() {
    if(Math.random() > 0.96) {
      ctx.fillStyle = 'brown';
      ctx.shadowColor = 'brown';
      ctx.shadowBlur = 40;
      ctx.globalAlpha = 0.15;
      arrastre.canvas.drawCircle(1200 * Math.random(), 800 * Math.random(), 100 + 300 * Math.random());
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  function drawTree() {
    ctx.save();

    ctx.strokeStyle = 'orange';
    ctx.shadowColor = 'orange';
    ctx.lineWidth = 0.5;
    ctx.shadowBlur = 20;

    ctx.translate(600, 300);

    ctx.globalAlpha = linkAlphaScale(arrastre.frameManager.ts);

    _.each(treeLinks, function(link) {
      var node0 = treeNodes[link.source.name];
      var node1 = treeNodes[link.target.name];

      if(node0.depth > depth || node1.depth > depth)
        return;

      // console.log(node0);
      arrastre.canvas.drawLine(node0.x, node0.y, node1.x, node1.y);
    });

    ctx.globalAlpha = 0.9;
  
    _.each(treeNodes, function(node) {
      // console.log(node.depth, depth);
      if(node.depth > depth)
        return;

      ctx.shadowColor = colorScale(node.depth);
      ctx.shadowBlur = 20;

      ctx.fillStyle = colorScale(node.depth);
      arrastre.canvas.drawCircle(node.x, node.y, radiusScale(node.depth));
    });

    ctx.restore();
  }


  function updateNodes(joints) {
    // Interpolate between treeNodes and joints

    function linearInterpolate(p0, p1, u) {
      return (1 - u) * p0 + u * p1;
    }

    _.each(joints, function(joint) {
      var jointType = joint.JointType;
      var node = treeNodes[jointType];

      var u = interpolationScale(arrastre.frameManager.ts);
      node.x = linearInterpolate(node.startX, xScale(joint.Position.X), u);
      node.y = linearInterpolate(node.startY, yScale(joint.Position.Y), u);
    });
  }

  function clear() {
    var alpha = alphaScale(arrastre.frameManager.ts);
    ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
    ctx.fillRect(0, 0, 1200, 800);
  }

  my.render = function() {
      var frame = arrastre.frameManager.currentFrame;

      if(!frame)
        return;

      var ts = arrastre.frameManager.ts;
      depth = Math.floor(depthScale(ts));
      // console.log(depth);

      var joints = getJointsOfSkeleton(frame, 0);
      if(!joints)
        return; 

      ctx.globalAlpha = 1;

      clear();
      arrastre.canvas.drawBackground();
      
      updateNodes(joints);
      drawTree();
  }


  initialiseTree();

  return my;
}());

