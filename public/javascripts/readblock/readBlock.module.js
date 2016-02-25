'use strict';

var readBlockApp = angular.module('readBlockApp', ['ngRoute']);

readBlockApp.directive('p', function() {
    console.log("highlight directive");
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      element.css({ cursor: 'pointer' });
      element.on('dblclick', function(e) {
        var range = window.getSelection() || document.getSelection() || document.selection.createRange();
        var word = range.toString().trim();
        if(word !== '') {
          console.log(word);
        }
        e.stopPropagation();
      });      
    }
  }
});