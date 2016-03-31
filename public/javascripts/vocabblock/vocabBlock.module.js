'use strict';

var vocabBlockApp = angular.module('vocabBlockApp', ['ngRoute']);

vocabBlockApp.controller('vocabBlockController', ['$scope', function($scope) {
  $scope.vocabContent = $scope.$parent.content[2];
}])