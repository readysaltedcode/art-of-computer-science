"use strict";
var arrastre = arrastre || {};

arrastre.dataManager = (function(){
  var my = {};

  my.frameData = [];

  /*-
  API
  -*/
  my.init = function() {
  }

  my.load = function(file) {
    d3.json(file, function(err, json) {
      my.frameData = json;
    });
  }

  return my;
}());