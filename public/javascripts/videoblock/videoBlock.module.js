'use strict';

var videoBlockApp = angular.module('videoBlockApp', ['ngRoute']);

//TODO remove highlight if re-selected / send word to database / tool-tip dictionary definition
videoBlockApp.directive('loadvideo', function() {
  
    return {
        // scope: {
        //   control: '='
        // },
        // restrict: 'E',
        link: function(scope, element, attrs) {
            setupVideo(scope.$parent.content[scope.contentId.id - 1].data.videoId);
        }
    }
});

// videoBlockApp.controller('videoBlockController', ['$scope', function($scope) {

// }])