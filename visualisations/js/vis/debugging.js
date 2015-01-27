
// BIGDATA
// For a single skeleton, each joint position is represented with 3 points (one for each co-ordinate). Each joint has a unique colour.
// The value of each co-ordinate is mapped to the y-axis. The x-axis is random.

function Debugging(canvas) {
  var width = 1200, height = 800;

  var color = d3.scale.category20();
  var xScale = d3.scale.linear().domain([-1.5, 1.5]).range([0, width]);
  var yScale = d3.scale.linear().domain([-1.5, 1.5]).range([height, 0]);

  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, width, height);

    function draw1(json, err) {
      var triangles = getTrianglesOfSkeleton(json, 0);

      // console.log(triangles);

      // ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      // ctx.fillRect(0, 0, width, height);
 
      // ctx.globalCompositeOperation = 'xor';
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
      _.each(json.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;
        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        ctx.lineTo(x,y);
      });

     ctx.fill();
  }

  function draw2(json, err) {
      var triangles = getTrianglesOfSkeleton(json, 0);

      // console.log(triangles);

      ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
      ctx.fillRect(0, 0, width, height);
 
      // ctx.globalCompositeOperation = 'xor';
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
      _.each(json.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;
        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        ctx.lineTo(x,y);
      });

     ctx.fill();
  }


  function draw3(json, err) {
      var triangles = getTrianglesOfSkeleton(json, 0);
 
       ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#aec7e8';

      _.each(triangles, function(triangle) {
        ctx.beginPath();
        _.each(triangle, function(vertex) {
          var x = xScale(vertex.X);
          var y = yScale(vertex.Y);
          ctx.lineTo(x, y);
        });
        ctx.fill();
      });

      // Draw head
      _.each(json.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;

        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        drawCircle(ctx, x, y, 18);
      });
  }

  function draw4(json, err) {
      var triangles = getTrianglesOfSkeleton(json, 0);

      // console.log(triangles);

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";   // 0.01 a nice setting
      ctx.fillRect(0, 0, width, height);
 
      _.each(triangles, function(triangle, index) {
        ctx.fillStyle = color(index);
        ctx.beginPath();
        _.each(triangle, function(vertex) {
          var x = xScale(vertex.X);
          var y = yScale(vertex.Y);
          ctx.lineTo(x, y);
        });
        ctx.fill();
      });

      // Draw head
      _.each(json.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;

        ctx.fillStyle = color(15);
        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        drawCircle(ctx, x, y, 18);
      });
  }


  function draw5(json, err) {
    
      var triangles = getTrianglesOfSkeleton(json, 0);

      // console.log(triangles);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";   // 0.01 a nice setting
      ctx.fillRect(0, 0, width, height);
 
      _.each(triangles, function(triangle, index) {
        ctx.fillStyle = color(index);
        ctx.beginPath();
        _.each(triangle, function(vertex) {
          var x = xScale(vertex.X);
          var y = yScale(vertex.Y);
          ctx.lineTo(x, y);
        });
        ctx.fill();
      });

      // Draw head
      _.each(json.Skeletons[0].Joints, function(j) {
        if(j.JointType !== 'Head')
          return;

        ctx.fillStyle = color(15);
        var x = xScale(j.Position.X);
        var y = yScale(j.Position.Y);
        drawCircle(ctx, x, y, 18);
      });
  }
  
  // poll();
  var drawFunction = draw1;

  setTimeout(function() {drawFunction = draw2;}, 8000);
  setTimeout(function() {drawFunction = draw3;}, 16000);
  setTimeout(function() {drawFunction = draw4;}, 24000);
  setTimeout(function() {drawFunction = draw5;}, 32000);
  
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
      drawFunction(json, err);
    });
  };
};