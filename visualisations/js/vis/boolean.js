
// BIGDATA
// For a single skeleton, each joint position is represented with 3 points (one for each co-ordinate). Each joint has a unique colour.
// The value of each co-ordinate is mapped to the y-axis. The x-axis is random.

function BooleanVis(canvas) {
  var width = 1200;
  var height = 800;

  // var color = d3.scale.category20();
  var color = d3.scale.linear().domain([-1, 0]).range(['white', 'red']);
  var scale = d3.scale.linear().domain([-3, 3]).range([0, 255]);
  var startTime = Date.now();

  // Duration 4:06
  var chanceOfBinary = d3.scale.linear().domain([startTime, startTime + 135000, startTime + 222000, startTime + 223000, startTime + 300000]).range([0, 0, 1, 1, 1]).clamp(true);
  var numCirclesScale = d3.scale.linear().domain([startTime, startTime + 135000, startTime + 222000, startTime + 223000, startTime + 300000]).range([0, 0, 5, 0, 0]).clamp(true);
  var textScale = d3.scale.linear().domain([startTime, startTime + 135000, startTime + 235000, startTime + 300000]).range([0, 0, 100, 100]).clamp(true);

  
  this.color = d3.scale.category20b();
  this.scale = d3.scale.linear().domain([-3, 6]).range([1000, 0]);
  this.indexScale = d3.scale.threshold().domain([0, 54000, 70000, 84000, 120000, 154000, 167000, 200000, 230000]).range([0, 3, 10, 40, 10, 1, 60, 20, 10, 10]);

  var ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, this.width, this.height);

  // poll()
  this.poll = function() {
    var me = this;
    d3.json('/playbackServer/api/data.json', function(err,json){me.draw(err,json);});
  };
  
  this.draw = function(err, json) {
    if(json === undefined) return;

    var data = getDataOfSkeleton(json, 0);
    // console.log(data);
    // data = data.slice(0, 8);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, this.width, this.height);

    // ctx.font = '15px sans-serif';

    var t = Date.now();

    var threshold = numCirclesScale(t);

    _.each(data, function(d, index) {
      // console.log(index);

      if(index > threshold)
        return;

      var drawAsBinary = Math.random() < chanceOfBinary(t);
      if(drawAsBinary) {

        var fontSize = Math.random() * textScale(t) + 8;
        ctx.font = 'bold ' + fontSize + 'px sans-serif';

        var binary = Math.round(scale(d)).toString(2);
        _.each(binary, function(bit) {
          var x = Math.random() * width;
          var y = Math.random() * height;
          ctx.fillStyle = bit === '1' ? 'red' : 'white';

          ctx.fillText(bit, x, y);
        });
      } else {
        var x = Math.random() * width;
        var y = Math.random() * height;
        ctx.fillStyle = color(d);

        drawCircle(ctx, x, y, 4);
      }
    });
  };
};