

  
function Algorithm(canvas) {
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, 1200, 800);

  this.ctx = ctx;
  this.treeLinks;
  this.startTime = Date.now();
  this.depth = 0.0;

  this.xScale = d3.scale.linear().domain([-1.7, 1.7]).range([0, 800]);
  this.yScale = d3.scale.linear().domain([-1.7, 1.7]).range([800, 0]);
  this.radiusScale = d3.scale.linear().domain([5, 0]).range([3, 16]);
  this.colorScale = d3.scale.linear().domain([0, 5]).range(['brown', 'yellow']);
  
  this.interpolationScale = d3.scale.linear().domain([0, 205000, 330000]).range([1, 1, 0.02]).clamp(true);
  this.depthScale = d3.scale.linear().domain([0, 31000, 47000, 62000, 77000, 94000]).range([0, 1, 2, 3, 4, 5]).clamp(true);
  this.alphaScale = d3.scale.linear().domain([0, 330000]).range([0.01, 0.2]).clamp(true);
  this.linkAlphaScale = d3.scale.linear().domain([0, 330000]).range([0, 1]).clamp(true);

  var treeLayout = d3.layout.tree()
  .size([500, 500]);

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

  var treeNodesArray = treeLayout(tree);
  var treeLinksArray = treeLayout.links(treeNodesArray);

  // keep tabs on original positions
  treeNodesArray = _.map(treeNodesArray, function(node) {
    node.startX = node.x,
    node.startY = node.y
    return node;
  });

  var myn = this;
  this.treeNodes = {};
  
  // convert to object
  _.each(treeNodesArray, function(node) {
    myn.treeNodes[node.name] = node;
  });
  
  //alert(" my node count " + this.treeNodes['ShoulderRight']);

  this.treeLinks = treeLinksArray;

  
  // poll()
  this.poll = function() {
    var me = this;
    d3.json('/playbackServer/api/data.json', function(err,json){me.draw(err,json);});
  };
  
  /**
   * Drawing begins
   */
  this.draw = function(err, json) {
    var ctx = this.ctx;
    
    if(json === undefined) {
      return;
    }

    this.depth = Math.floor(this.depthScale(Date.now() - this.startTime));
    
    var joints = this.getJointsOfSkeleton(json, 0);
    if(!joints) {
      return;
    }

    this.ctx.globalAlpha = 1;

    this.clear();

    this.updateNodes(joints);
    this.drawTree();
  };
  
  /**
   * Utility methods
   */
  
  
  this.getJointsOfSkeleton= function(json, skeleton) {
    // Transform Kinect data into object
    var joints = {};
    if(json.Skeletons === undefined)
      return [];
    if(skeleton > json.Skeletons.length - 1)
      return [];
    _.each(json.Skeletons[skeleton].Joints, function(joint) {
      joints[joint.JointType] = joint;
    });
    return joints;
  }


  this.drawTree = function() {
    this.ctx.save();

    this.ctx.strokeStyle = 'orange';
    this.ctx.lineWidth = 0.5;

    this.ctx.translate(300, 100);

    this.ctx.globalAlpha = this.linkAlphaScale(Date.now() - this.startTime);

    var treeNodes = this.treeNodes;
    var depth = this.depth;
    var ctx = this.ctx;
    var colorScale = this.colorScale;
    var radiusScale = this.radiusScale;
    _.each(this.treeLinks, function(link) {
      var node0 = treeNodes[link.source.name];
      var node1 = treeNodes[link.target.name];

      if(node0.depth > depth || node1.depth > depth)
        return;

      // console.log(node0);
      drawLine(ctx, node0.x, node0.y, node1.x, node1.y);
    });
    
    this.ctx.globalAlpha = 0.9;
  
    _.each(treeNodes, function(node) {
      // console.log(node.depth, depth);
      if(node.depth > depth)
        return;
        
      ctx.fillStyle = colorScale(node.depth);
      drawCircle(ctx, node.x, node.y, radiusScale(node.depth));
      // ctx.fillStyle = 'white';
      // ctx.textAlign = 'center';
      // ctx.fillText(node.name, node.x, node.y);
    });

    this.ctx.restore();
  }


  this.updateNodes = function(joints) {
    // Interpolate between treeNodes and joints

    function linearInterpolate(p0, p1, u) {
      return (1 - u) * p0 + u * p1;
    }

    var interpolationScale = this.interpolationScale;
    var treeNodes = this.treeNodes;
    var xScale = this.xScale;
    var yScale = this.yScale;
    var startTime = this.startTime;
    
    _.each(joints, function(joint) {
      
      var jointType = joint.JointType;
      var node = treeNodes[jointType];

      // console.log(joint, node);
      //alert (interpolationScale);
      var u = interpolationScale(Date.now() - startTime);
      node.x = linearInterpolate(node.startX, xScale(joint.Position.X), u);
      node.y = linearInterpolate(node.startY, yScale(joint.Position.Y), u);
    });

    // console.log(treeNodes);    
  }


  this.clear = function() {
    // ctx.globalAlpha = 0.9;
    var alpha = this.alphaScale(Date.now() - this.startTime);
    this.ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
    this.ctx.fillRect(0, 0, 1200, 800);
  };


};