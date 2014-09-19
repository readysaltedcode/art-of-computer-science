
// BIGDATA
// For a single skeleton, each joint position is represented with 3 points (one for each co-ordinate). Each joint has a unique colour.
// The value of each co-ordinate is mapped to the y-axis. The x-axis is random.

function FadeOut(canvas) {
  this.width = 1200;
  this.height = 800;

  this.startTime = Date.now();

  this.color = d3.scale.category20b();
  this.scale = d3.scale.linear().domain([-3, 6]).range([1000, 0]);
  this.indexScale = d3.scale.threshold().domain([0, 54000, 70000, 84000, 120000, 154000, 167000, 200000, 230000]).range([0, 3, 10, 40, 10, 1, 60, 20, 10, 10]);

  this.ctx = canvas.getContext('2d');
  
  this.ctx.fillStyle = "rgb(0,0,0)";
  this.ctx.fillRect(0, 0, this.width, this.height);

  // poll()
  this.poll = function() {
    var me = this;
    d3.json('/playbackServer/api/data.json', function(err,json){me.draw(err,json);});
  };
  
  this.draw = function(err, json) {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    var startTime = this.startTime;
    var scale = this.scale;
    var indexScale = this.indexScale;
    var color = this.color;
    if(json === undefined) {
      return;
    }

    var data = getDataOfSkeleton(json, 0);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(0, 0, width, height);

  };
};