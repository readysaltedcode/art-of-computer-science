"use strict";
var arrastre = arrastre || {};


arrastre.frameManager = (function(){
  var my = {};
  
  my.remotePath='http://localhost:8111/?callback=?';

  var frameFetched = function(data) {
    my.frameData = data;
    $.getJSON(my.remotePath,null, frameFetched);
  }
  
  /*-
  API
  -*/
  my.init = function() {
    $.getJSON(my.remotePath,null, frameFetched);
  }

  my.reset = function() {
  }

  my.updateFrame = function() {
    my.currentFrame = my.frameData;
  }

  my.init();
  return my;
}());