/* (C) 2014 Peter Cook (@prcweb) MIT License */
(function(){

  var canvas = null,
      ctx = null;

  var config = {
    canvasSize: {x: 800, y: 800},
    // mondrian: true
  };

  // var config = {};

  var options = [
    {name: 'Original data', config: {mode: 'or', shape: 'circle', size: 2}},
    {name: 'OR circles', config: {mode: 'or', shape: 'circle', size: 50}},
    {name: 'OR squares', config: {mode: 'or', shape: 'square', size: 50}},
    {name: 'XOR circles', config: {mode: 'xor', shape: 'circle', size: 50}},
    {name: 'XOR squares', config: {mode: 'xor', shape: 'square', size: 30}},
    {name: 'XOR big squares', config: {mode: 'xor', shape: 'square', size: 200}},
    {name: 'AND big squares', config: {mode: 'and', shape: 'square', size: 250}},
    {name: 'AND big circles', config: {mode: 'and', shape: 'circle', size: 300}},
  ]


  var frameNum = 0;
  var data = [];
  var dataLength = 0;

  var xScale = d3.scale.linear().domain([-1.2, 1.2]).range([0, config.canvasSize.x]);
  var yScale = d3.scale.linear().domain([-1.5, 0.9]).range([config.canvasSize.y, 0]);

  var mondrianColors = ['#FE0002', '#0000FE', '#FFFF01'];

  /*--
  INIT
  --*/
  function init() {
    _.extend(config, options[0].config);

    canvas.width = config.canvasSize.x;
    canvas.height = config.canvasSize.y;

    initOptionMenu();
  }

  function initOptionMenu() {
    d3.select('.options')
      .selectAll('div')
      .data(options)
      .enter()
      .append('div')
      .classed('option', true)
      .classed('selected', function(d, i) {return i ===0 ;})
      .text(function(d) {return d.name;})
      .on('click', function(d) {
        _.extend(config, d.config);
        d3.selectAll('.options .option')
          .classed('selected', false);
        d3.select(this)
          .classed('selected', true);
        console.log(frameNum,dataLength)

        // Restart if ended
        if(frameNum === dataLength) {
          frameNum = 0;
          update();
        }

        frameNum = 0;
      });
  }

  /*----
  UPDATE
  ----*/
  function update() {
    // Animation loop timing thanks to http://creativejs.com/resources/requestanimationframe/
    if(frameNum < dataLength) {
      setTimeout(function() {
        requestAnimationFrame(update);
        clearContext();
        draw();
        frameNum++;
      }, 50);
    }

  }

  function clearContext() {
    ctx.clearRect(0, 0, config.canvasSize.x, config.canvasSize.y);
  }

  function draw() {
    var frame = data[frameNum];

    ctx.fillStyle = 'green';

    _.each(frame.joints, function(joint, i) {
      var pos = joint.pos;

      switch(config.mode) {
        case 'and':
          ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'source-in';
          break;
        case 'or':
          ctx.globalCompositeOperation = 'source-over';
          break;
        case 'xor':
          ctx.globalCompositeOperation = i == 0 ? 'source-over' : 'xor';
          break;
      }


      var x = xScale(pos.x), y = yScale(pos.y);
      switch(config.shape) {
        case 'square':
          ctx.fillRect(x - config.size, y - config.size, 2 * config.size, 2 * config.size);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, config.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      if(config.mondrian) {
        ctx.fillStyle = mondrianColors[i % mondrianColors.length];
      }

      // console.log(frame.ts);
    });


  }


  d3.json('data/skeletons.json', function(err, json) {
    // console.log(json);
    data = json;
    dataLength = data.length;

    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');

    init();
    update();
  });

})();
