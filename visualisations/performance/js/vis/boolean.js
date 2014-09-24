"use strict";
var arrastre = arrastre || {};
arrastre.vis = arrastre.vis || {};

arrastre.vis.boolean = (function(){
  var my = {};

  var width = 1200, height = 800;
  // var startTime = Date.now();

  // var color = d3.scale.category20();
  var color = d3.scale.linear().domain([-1, 0]).range(['white', 'blue']);
  var scale = d3.scale.linear().domain([-3, 3]).range([0, 255]);

  // Duration 4:06
  var chanceOfBinary = d3.scale.linear().domain([0, 145000, 222000, 223000, 300000]).range([0, 0, 0.6, 0, 0]).clamp(true);
  var numCirclesScale = d3.scale.linear().domain([0, 135000, 222000, 223000, 300000]).range([0, 0, 4, 0, 0]).clamp(true);
  // var textScale = d3.scale.linear().domain([0, 135000, 235000, 300000]).range([0, 0, 100, 100]).clamp(true);

  // var additionalBackgroundChance = d3.scale.linear().domain([startTime, startTime + 135000, startTime + 222000, startTime + 223000, startTime + 300000]).range([1, 0.98, 0.5, 0.98, 0.99]).clamp(true);

  var canvas = document.getElementById('mycanvas');
  var ctx = canvas.getContext('2d');

  my.render = function() {

    ctx.globalAlpha = 0.1;

    var frame = arrastre.frameManager.currentFrame;

    if(!frame)
      return;

    ctx.globalAlpha = 0.5;

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);


    var ts = arrastre.frameManager.ts;

    var threshold = numCirclesScale(ts);

    var data = getDataOfSkeleton(frame, 0);

    _.each(data, function(d, index) {
      // console.log(index);

      if(index > threshold)
        return;

      var drawAsBinary = Math.random() < chanceOfBinary(ts);
      if(drawAsBinary) {

        // var fontSize = Math.random() * textScale(t) + 8;
        var fontSize = 12;
        ctx.font = 'bold ' + fontSize + 'px sans-serif';

        var binary = Math.round(scale(d)).toString(2);
        _.each(binary, function(bit) {
          var x = Math.random() * width;
          var y = Math.random() * height;
          ctx.fillStyle = bit === '1' ? 'blue' : '#888';

          ctx.fillText(bit, x, y);

          if(bit === '1') {
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 30;
            ctx.globalAlpha = 0.1;
            drawCircle(ctx, x, y, 100 * Math.random());
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }

        });
      } else {
        var x = Math.random() * width;
        var y = Math.random() * height;

        ctx.fillStyle = color(d);

        drawCircle(ctx, x, y, 3);
      }
    });
  }

  return my;
}());



//   function poll() {
//     d3.json('/playbackServer/api/data.json', function(err, json) {
//       if(json === undefined) return;

//       var data = getDataOfSkeleton(json, 0);
//       // console.log(data);
//       // data = data.slice(0, 8);


//       // ctx.font = '15px sans-serif';

//       // var t = Date.now();

//       // drawAdditionalBackground(t);

//   }



//   ctx.fillStyle = "rgb(0,0,0)";
//   ctx.fillRect(0, 0, width, height);

//   // poll();
//   setInterval(poll, 50);
 
// </script>
// </body>
