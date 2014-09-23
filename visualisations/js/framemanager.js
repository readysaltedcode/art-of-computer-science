"use strict";
var arrastre = arrastre || {};

arrastre.frameManager = (function(){
  var my = {};

  my.currentFrame = {};
  my.currentFrameNum = 0;

  var startTs = 0; // timestamp at which visualisation was started

  /*-
  API
  -*/
  my.init = function() {
  }

  my.reset = function() {
    startTs = Date.now();
    my.currentFrame = {};
    my.currentFrameNum = 0;
  }

  my.updateFrame = function() {
    var frameData = arrastre.dataManager.frameData;
    var numFrames = frameData.length;
    var ts = Date.now() - startTs;

    for(var i = my.currentFrameNum + 1; i < numFrames; i++) {
      if(frameData[i].TimeStamp > ts) {
        my.currentFrame =  frameData[i-1];
        my.currentFrameNum = i-1;
        return;
      }
    }

    // End of data: do nothing
    return;
  }


  return my;
}());